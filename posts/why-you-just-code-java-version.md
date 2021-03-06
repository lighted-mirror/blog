---
path: "/why-you-just-code-java-version"
date: "2018-03-19"
title: "为什么说你只是敲了一遍“java -version”？"
author: "ygy4870"
tags: ["Java"]
---

好吧！是我只敲了一遍。
当我下载需要的jdk并安装、配置java_home、classpath、添加path路径后，通常会打开cmd命令行（windows环境），输入“java -version”，回车，出现如下所示：

``` base
java version "1.7.0_79"
Java(TM) SE Runtime Environment (build 1.7.0_79-b15)
Java HotSpot(TM) 64-Bit Server VM (build 24.79-b02, mixed mode)
```

嗯，很好，jdk安装配置没问题，是1.7的版本，好开心，完事，收工。
但事实上从上面三行输出中只用到了第一行：java version "1.7.0_79"，我安装了jdk7。其实剩下两行表达了更多的意思。所以，今天我把“java -version”又敲了一遍,厚脸皮地把别人总结过的再写一次，好不要脸。
简单来说，第一行说的是JDK,第二行是JRE,第三行是JVM。
# java version "1.7.0_79"

JDK1.7版本，这个我们通常关注的是版本语法的区别，高版本具有更高效的使用语法，且向后兼容，即高版本可运行低版本的代码，反之不行。

# Java(TM) SE Runtime Environment (build 1.7.0_79-b15)

字面意思“JAVA运行时环境”，字如其意，也就是说你要运行java程序必须要有JRE，它提供JAVA程序运行所需的环境，比如运行eclipse。JRE可单独安装，如果你只是一个java程序的使用者，而不是开发者，大可不必安装JAVA开发工具包Java Development Kit(JDK)。有没有注意到，在安装JDK的时候，安装了两次JRE。从目录来看，在安装的jdk目录下，有一个jre,这个叫专用JRE，在非jdk安装目录下还有一个jre，这个叫公共JRE。也就是说，JRE有专有和公共之别。除了上述说的目录区别外，公共JRE会添加到注册表，那么便会作为操作系统的一个程序被大家使用，谓之公共。专有JRE,谁专有，JDK专有。专有JRE,除了拥有公共JRE提供的JAVA程序运行的最小环境外，还提供有开发所需的其他功能，如javac等。可以这么说，在功能上公共JRE是JDK专有JRE的一个子集，所以两者的文件也是不一样的，不能进行简单的替换。

# Java HotSpot(TM) 64-Bit Server VM (build 24.79-b02, mixed mode)
第三行的信息量有点大。

## HotSpot(TM)

在这里是具体的一个JVM实现。我们知道JVM只是一个规范，在遵循规范的前提下，各个厂商实现了自己的JVM,有些是开源的，其中HotSpot，是Sun JDK和OpenJDK中所带的虚拟机，也是目前使用范围最广的Java虚拟机。每个具体的JVM都有不同的特点，这里不细说（因为不知道）。所以当我们讨论诸如gc时，我们的立足点应该是具体实现的JVM,才更有意义。

## 64-Bit

JVM全称JAVA虚拟机，虽然是一个软件，一个程序，但是是一个模拟物理机的软件，所以也有32bit和64bit的区别。比如32bit，大体指的是CPU内部寄存器和寻址总线是32位，指令集可以运行32位数据指令，也就是说一次可以提取32位数据，最大寻址空间为2的32次方也就是4G。所以当你的JVM是为32bit时，无论你的物理机有多大的内存，你的JVM启动参数配置分配多大的内存，理论上JVM能使用到的不可能超过4G,由于实际很多原因，远远达不到4G。64bit同理。那是不是说64bit的JVM就一定比32bit的要好呢，这倒未必，这里不讨论（因为不知道）。

## Server

好吧，JVM竟有Client和Server之别，这里的Client表示是针对桌面程序的JVM，特点是启动较快，而Server便是针对服务器也就是我们最常接触的web应用，较之Client启动很慢，但运行性能比Client好得多。我们知道，让Java这门语言扬名立万的领域正是web领域，我们都快忘了Java本身也是可以写桌面应用的了。事实上用Java写桌面应用并不差，如eclipse就是个很好的例子。不过Java官方感觉已经放弃桌面应用领域了，事实上64bit的JVM 目前只支持Server类型的。以client还是server方式启动运行JVM是可配置的（前提是32bit JVM）。配置可参考：[这里](http://blog.csdn.net/sunxiakun/article/details/45242653)

以上对JDK、JRE、JVM做了一个非常非常简单的介绍，可以使劲喷。然后还是要非常俗套的介绍下这三者关系，我想从目录结构上狭隘的讲一下三者关系。
以这个路径为例：jdk\jre\bin\server\jvm.dll。jdk安装路径为\jdk，jdk路径下有jre，当然还有很多其他开发工具目录；而jdk\jre\下有bin和lib目录，这个bin下有server（如果是32bit还会有client），server下有jvm.dll（windows下），我们知道JVM底层依赖其实是C/C++，所以jvm.dll这个动态链接库文件才是JVM操作的实际核心。所以JDK包含JRE，JRE包含JVM。JDK作为J开发工具包除了有运行JAVA程序的JRE外，更应该有开发这个JAVA程序的开发、调试等的工具、类库；而JRE除了有执行字节码的JVM实现外，还有依赖的核心类库，如rt.jar。最后JVM是Java中最核心的。

# 小结
- JRE有专有和公共之分。
- JVM有各种厂家的各种实现，有32bit和64bit之分，有server和client之别。
- 从包含关系看，JDK包含JRE包含JVM。

很久很久没写东西了，所以没有什么特色（写多了也不会有），也基础，内容也不多，欢迎各种喷，使劲喷！


