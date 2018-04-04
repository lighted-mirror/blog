---
path: "/BlockingQueue-ArrayBlockingQueue"
date: "2018-03-18"
title: "BlockingQueue-ArrayBlockingQueue 源码解析"
author: "MelodyFrom"
tags: ["源码解析", "Java"]
---

# 一 简述

API文档阅读理解的信息：

一种支持额外操作的队列接口(BlockingQueue)，当队列为空的时候，向队列获取元素可以一直等到队列转换为**非空状态**。而当队列已满的时候，从队列获取元素可以一直等到队列已腾出空间。

队列的操作方法大致可以分为四种类型

1. 队列满或空的时候，插入或删除元素抛出异常
2. 队列满或空的时候，插入或删除元素返回一个特殊值(null或者false)
3. 队列满或空的时候，插入或删除元素的线程阻塞直到操作成功
4. 队列满或空的时候，插入或删除元素的线程会阻塞一个指定的时长然后放弃



操作 | 抛出异常 | 返回特殊值 | 阻塞 | 限时阻塞 |
---|---|--|--|--|
插入 | add(e) | offer(e) |put(e) |offer(e, time, unit) |
删除 | remove() | poll() |take() |poll(time, unit) |
检查 | element() | peek() | | |

注：此表出自api文档

**阻塞队列不接受null元素，它的一系列实现类都会在尝试插入null时抛出空指针异常。**

阻塞队列不同的实现会对队列长度有不同的定义。不被限制容量的队列的剩余长度是Integer.MAX。

阻塞队列是线程安全的，大多数是基于内部锁或者其他同步机制实现。不过批量操作比如**addAll,containsAll,retainAll和removeAll不一定安全。**

另外，阻塞队列十分适合应用于“生产-消费者模型”的场景。

# 二 典型实现 ArrayBlockingQueue

基于数组实现的长度一定的阻塞队列，这个队列保持着FIFO先进先出的顺序。队首的元素是在队列中保存时间最长的；队尾的元素是在队列中保存时间最短的。新的元素入队都是加入到队尾，元素出队都是从队首元素获取。

作为一个典型的**指定长度的阻塞队列**，一旦被创建，这个队列的长度就不会再改变。向已满的队列插入元素和向空队列获取元素都可以进入阻塞状态。

**支持遍历器的通用操作**

## 2.1 类成员

``` java

    /** The queued items */
    final Object[] items;

    /** items index for next take, poll, peek or remove */
    int takeIndex;

    /** items index for next put, offer, or add */
    int putIndex;

    /** Number of elements in the queue */
    int count;

    /*
     * Concurrency control uses the classic two-condition algorithm
     * found in any textbook.
     */

    /** Main lock guarding all access */
    final ReentrantLock lock;

    /** Condition for waiting takes */
    private final Condition notEmpty;

    /** Condition for waiting puts */
    private final Condition notFull;

    /**
     * Shared state for currently active iterators, or null if there
     * are known not to be any.  Allows queue operations to update
     * iterator state.
     */
    transient Itrs itrs = null;
```

- items：用于容纳队列中元素的底层对象数组。注意关键字**final**，也就是说一旦被初始化，这个数组的长度就是不可变的。
- takeIndex：阻塞队列内部维护的一个“指针”，这是一个队列的“尾指针”。指向队列中即将被删除、出队的元素
- putIndex：阻塞队列内部维护的另一个“指针”，这是一个队列的“头指针”。指向队列中刚刚被插入的元素
- count：队列中的size字段

这个阻塞队列的实现里总计有一个锁lock、两个条件对象notEmpty与notFull，分别用于不同的场景

- lock：用于数据访问保护的锁
- notEmpty 队列非空条件，用于获取元素时的场景
- notFull 队列未满条件，用于插入元素时的场景

这里可以着重了解一下源代码中关于这两个condition对象notEmpty与notFull的应用方式。这本身就是lock对象比synchronized关键字的同步控制更为精细的地方，如何为线程分组，如何去更细粒度的控制唤醒指定的线程组。

**同时由于只有一个retreenlock实例，所以不会真正的存在结构性修改的方法并行的场景，这些结构性修改方法都是互斥的。**

## 2.2 方法API

### 2.2.1 构造函数

注意在编写了三个含参的构造函数后，没有给出无参构造。这个阻塞队列因此就没有无参构造。所有的构造函数都要求给出具体的队列size值。

``` java
    //指定队列容量的构造，默认是一个非公平阻塞队列
    public ArrayBlockingQueue(int capacity) {
        this(capacity, false);
    }
    
    //指定队列容量和队列公平性的阻塞队列，这里初始化锁对象和两个条件对象，指定lock为公平锁
    public ArrayBlockingQueue(int capacity, boolean fair) {
        if (capacity <= 0)
            throw new IllegalArgumentException();
        this.items = new Object[capacity];
        lock = new ReentrantLock(fair);
        notEmpty = lock.newCondition();
        notFull =  lock.newCondition();
    }
    
    //初始化队列容量、公平策略和来自另一个集合的元素。内部调用前一个包含两个参数的构造。这里的初始化队列元素的部分开始加锁操作。元素顺序遵从集合c的便利顺序。加锁是为了数据在各个线程间的可见性而不是为了保证互斥性。不过正常的逻辑都是先初始化，再有结构性修改。
    public ArrayBlockingQueue(int capacity, boolean fair,
                              Collection<? extends E> c) {
        this(capacity, fair);

        final ReentrantLock lock = this.lock;
        lock.lock(); // Lock only for visibility, not mutual exclusion
        try {
            int i = 0;
            try {
                for (E e : c) {
                    checkNotNull(e);
                    items[i++] = e; //“头插”的顺序
                }
            } catch (ArrayIndexOutOfBoundsException ex) {
                throw new IllegalArgumentException();
            }
            count = i; // 循环结束后累加队列size值
            putIndex = (i == capacity) ? 0 : i; // 更新用于插入操作的索引，判断这个值目前还是不是0
        } finally {
            lock.unlock(); // 释放锁
        }
    }

```

### 2.2.2 插入操作

**返回true or false的offer入队操作**

``` java
    public boolean offer(E e) {
        checkNotNull(e);
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            if (count == items.length)
                return false; //队列已满则返回false表示插入失败
            else {
                enqueue(e);
                return true;
            }
        } finally {
            lock.unlock();
        }
    }
    
    
    /**
     * Inserts element at current put position, advances, and signals.
     * Call only when holding lock.
     */
    private void enqueue(E x) {
        // assert lock.getHoldCount() == 1;
        // assert items[putIndex] == null;
        final Object[] items = this.items;
        items[putIndex] = x;
        if (++putIndex == items.length)
            putIndex = 0;
        count++;
        notEmpty.signal(); //唤醒一个因为队列为空导致等待的线程，notEmpty为非空条件condition对象。很灵活
    }
```

offer入队操作，注意因为队列不能插入null，所以在check方法里面如果检查到e是null的话会抛出NPE。除此之外，这个方法本身的入队操作只会依据操作结果返回**true或者false**。

这里可以看到该队列中的加锁固定格式

``` java
    ReentrantLock lock = new ReentrantLock();
    lock.lock(); //加锁
    try {
        
    } finally {
        lock.unlock(); //finally子句释放锁
    }

```

**可以抛出异常的add插入元素**

``` java
    public boolean add(E e) {
        return super.add(e);
    }
    --super--
    //java.util.AbstractQueue.add(E)
    public boolean add(E e) {
        if (offer(e))
            return true;
        else
            throw new IllegalStateException("Queue full");
    }

```

可以看到阻塞队列的add操作调用父类的add操作，而父类的add操作还是会因为多态的关系调用到具体实现类里面的offer入队操作。如果插入成功就返回true，否则会抛出**IllegalStateException**。那么对应的，这里除了这个异常，因为调用了原来的offer方法的缘故，也有可能抛出NPE异常。

能看到这里也体现了一定的层次结构的设计思想，达到的代码和方法的复用的目的，先从最基础的方法开始编写，然后依次嵌套或者包装写出能达到特定目的的方法。比如这里的offer与add之间的关系。

AbstractQueue就是根据前述的方法表格来做了一定的规范限制和方法调用关系限制。后面的具体实现类只要按照标准去实现就好了。整个类的结构看起来就会比较清晰，也会少很多代码的冗余。

**会阻塞的put方法**

``` java
    /**
     * Inserts the specified element at the tail of this queue, waiting
     * for space to become available if the queue is full.
     *
     * @throws InterruptedException {@inheritDoc}
     * @throws NullPointerException {@inheritDoc}
     */
    public void put(E e) throws InterruptedException {
        checkNotNull(e);
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly();
        try {
            while (count == items.length) //检查队列长度是否已满，如果满了就进入await方法。其余的出队操作会在操作末尾调用notFull.signal()下次被唤醒再次进入while循环判断一次。直到队列空出类为止。这里的逻辑类似于“double check”
                notFull.await();
            enqueue(e); //检查通过执行入队操作
        } finally {
            lock.unlock();
        }
    }
```

然后是会阻塞等待的put方法。这个方法会在当队列已满的时候，向其中插入元素会形成阻塞直到插入元素。

ps 方法**lock.lockInterruptibly()？**

**限时阻塞的offer**

```` java
    public boolean offer(E e, long timeout, TimeUnit unit)
        throws InterruptedException {

        checkNotNull(e);
        long nanos = unit.toNanos(timeout);
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly();
        try {
            while (count == items.length) {
                if (nanos <= 0)
                    return false;
                nanos = notFull.awaitNanos(nanos);
            }
            enqueue(e);
            return true;
        } finally {
            lock.unlock();
        }
    }
    
````

限时等待方法，注意里面的一个方法**notFull.awaitNanos()**。这个方法不仅仅是API里面用。平时我们自己用作限时等待的场景时，也会用起来很顺手。搭配while循环来使用。


### 2.2.3 删除队首元素

首先还是从会被复用的基础出队方法开始

**返回被删除元素或者null的poll**

``` java
    public E poll() {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            return (count == 0) ? null : dequeue();
        } finally {
            lock.unlock();
        }
    }
    
    /**
     * Extracts element at current take position, advances, and signals.
     * Call only when holding lock.
     */
    private E dequeue() {
        // assert lock.getHoldCount() == 1;
        // assert items[takeIndex] != null;
        final Object[] items = this.items;
        @SuppressWarnings("unchecked")
        E x = (E) items[takeIndex];
        items[takeIndex] = null; //因为这个索引位置的元素已经出队，所以将该位置置空
        if (++takeIndex == items.length) //循环数组的操作，如果出队操作已经走到了队尾，那么久重置索引的位置到队首
            takeIndex = 0;
        count--;
        if (itrs != null)
            itrs.elementDequeued();  //TODO
        notFull.signal();
        return x;
    }
```

与前面一节的入队操作类似，这里有一个单独的如对操作，但是这个方法是有使用条件的，那就是**加锁同步**，不过我们没有在方法里面进行同步，而是要求调用dequeue方法的方法做同步工作。**该方法会返回出队元素或者是返回null。**


**返回true或false的remove(e)**

``` java
    public boolean remove(Object o) {
        if (o == null) return false;
        final Object[] items = this.items;
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            if (count > 0) {
                final int putIndex = this.putIndex;
                int i = takeIndex;
                do {
                    if (o.equals(items[i])) {
                        removeAt(i);
                        return true;
                    }
                    if (++i == items.length)
                        i = 0;
                } while (i != putIndex);
            }
            return false;
        } finally {
            lock.unlock();
        }
    }
    
```

- 删除指定元素的remove(e)方法。该方法匹配元素的原则是equals方法达成匹配。删除的具体操作在方法removeAt方法中。
- 如果队列中包含多个相同元素，那么只会删除遍历到的第一个元素。
- 删除成功返回true，否则返回false
- 遍历的原则是从takeIndex开始将整个内部数组遍历一遍直到遍历到索引putIndex为止。找到对应元素的位置后就可以调用removeAt来删除指定的元素。

``` java
    void removeAt(final int removeIndex) {
        // assert lock.getHoldCount() == 1;
        // assert items[removeIndex] != null;
        // assert removeIndex >= 0 && removeIndex < items.length;
        final Object[] items = this.items;
        if (removeIndex == takeIndex) { //先判断参数索引位置是不是就是删除索引值，如果是的话就直接删除
            // removing front item; just advance
            items[takeIndex] = null;
            if (++takeIndex == items.length) // 循环数组的索引调整
                takeIndex = 0;
            count--; //递减队列长度
            if (itrs != null)
                itrs.elementDequeued(); //遍历器的队列出队方法，较复杂
        } else {
            // an "interior" remove

            // slide over all others up through putIndex.
            final int putIndex = this.putIndex;
            for (int i = removeIndex;;) {
                int next = i + 1;
                if (next == items.length)
                    next = 0;
                if (next != putIndex) {
                    items[i] = items[next];
                    i = next;
                } else {
                    items[i] = null;
                    this.putIndex = i;
                    break;
                }
            }
            count--;
            if (itrs != null)
                itrs.removedAt(removeIndex);
        }
        notFull.signal(); // 执行完遍历检查和删除的操作后唤醒一个notFull状态下进入等待的线程。
    }
```

- 用于删除指定位置元素的方法，调用此方法前先加锁
- 遍历器删除和对外提供的remove方法都使用了此方法


**阻塞的take()方法**


``` java
    public E take() throws InterruptedException {
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly();
        try {
            while (count == 0)
                notEmpty.await();
            return dequeue();
        } finally {
            lock.unlock();
        }
    }
```

删除队首元素的dequeue方法。这个方法的底层还是调用了dequeue方法。出队前判断队列长度，如果长度为0则进入while循环的等待状态，并且使用while会使得每一次在该位置进入等待状态的线程在被唤醒后都会再次检查队列长度。保证的数据的一致性和安全。

**限时阻塞的poll方法**

``` java
    public E poll(long timeout, TimeUnit unit) throws InterruptedException {
        long nanos = unit.toNanos(timeout);
        final ReentrantLock lock = this.lock;
        lock.lockInterruptibly();
        try {
            while (count == 0) {
                if (nanos <= 0)
                    return null;
                nanos = notEmpty.awaitNanos(nanos);
            }
            return dequeue();
        } finally {
            lock.unlock();
        }
    }
```

和限时阻塞的offer类似，会利用一个循环+nanos的结构来使得线程等待指定的时长，**如果没能在这段时间内成功执行出队操作的话，就会返回一个null结束。**


### 2.2.4 检查队首元素


**抛出异常的element**

``` java
    /**
     * Retrieves, but does not remove, the head of this queue.  This method
     * differs from {@link #peek peek} only in that it throws an exception if
     * this queue is empty.
     *
     * <p>This implementation returns the result of <tt>peek</tt>
     * unless the queue is empty.
     *
     * @return the head of this queue
     * @throws NoSuchElementException if this queue is empty
     */
    public E element() {
        E x = peek();
        if (x != null)
            return x;
        else
            throw new NoSuchElementException();
    }
    

```

这个方法位于抽象类AbstractQueue中。不过方法本身调用了带返回值的peek方法。然后根据场景，只要队首返回元素为null的话就抛出异常NoSuchElementException。

**返回队首元素的peek**

``` java
    public E peek() {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            return itemAt(takeIndex); // null when queue is empty
        } finally {
            lock.unlock();
        }
    }
    
    final E itemAt(int i) {
        return (E) items[i];
    }
    
```

返回队首元素的peek方法也是做了同步处理的。注意ArrayBlockingQueue是不允许null元素的。所以当返回的队首元素为null的时候即表示队列为空了。**这里就是API里面描述的，peek方法在队列为空的时候返回null而element方法抛出异常。**并且element方法定义在抽象类AbstractQueue中，所以这个方法可以说是通用的，就是调用peek方法然后检查返回值是否为null。

# 三 综述

阻塞队列本身位于concurrent并发包下，接口blockingquene有多个不同的实现。这个接口本身的实现类都会常用的接口性修改方法做了同步处理。

典型的ArrayBlockingQuene类，其内部实现基于一个定长的对象数组。而且这个类没有默认的构造函数，所有的构造函数都要求给出队列初始化的长度。即没有默认长度。其同步操作基于可重入锁reentrantlock，并且把插入和删除操作分组管理，每一组都有各自的condition对象(共计两个condition对象)。相比使用synchronized关键字和我们平常自己实现的“生产-消费者”模型，这种实现逻辑能达成更好的细粒度控制。