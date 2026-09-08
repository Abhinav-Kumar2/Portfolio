---
title: Deep Speech 2: End-to-End Speech Recognition in English and Mandarin
date: 2026-09-08
description: A practical walkthrough of Deep Speech 2, its end-to-end speech recognition architecture, and the techniques it uses for English and Mandarin.
tags: [speech-recognition, deep-learning, machine-learning, research]
---

This is the entire walkthrough of the **Deep Speech 2** paper. Pretty amazing paper from Baidu Research in 2015!!!

We will be discussing the architecture it has used to recognize **English and Mandarin** speech and particularly the basic intuition behind the practical steps taken in deep recurrent speech recogniton. 

Arxiv link: [**https://arxiv.org/abs/1512.02595**](https://arxiv.org/abs/1512.02595)

Just like always, please comment if you find something incorrect or vague in the following blog. Thank you for reading!

_______________________________________________________________________________

Speech recognition looks and seems pretty simple. You know to a layman, the task at hand might be to just match the audio sample to the word and then form the sentence. 

Lets say, Iron Man aka Tony Stark and Morgan Stark (his daughter) speaks the same sentence. 

> *"I love you, 3000.”*
> 

![image.png](Deep%20Speech%202%20End-to-End%20Speech%20Recognition%20in%20Eng/image.png)

The computer should definitely output the same sentence as text when both are given as input

> *"I love you, 3000.”*
> 

HOwever, there would be a huge (Yes, very huge) amount of variation hidden inside both the audios for that sentence. 

Tony and Morgan say exactly the same words. But Tony is an adult male with his fully developed vocal cords and Morgan is a little girl with entirely different vocal cords. 
Both them may have completely different accents, the rate of their speaking, microphone quality and background noise. 

One person might be sitting in a quiet room while another is talking from inside a moving machine (if he calls from iron man suit, maybe then?). 

To handle this, our system needs to figure out which sequence of characters best explains the audio.

Before Deep Speech 2, doing this involved a complicated collection of individually engineered components for acoustic modeling, pronunciation and language modeling. 

The Deep Speech line of work asked a very basic question that you and I can also think of ! 
**What if we just trained one neural network to map speech directly to text?**

Deep Speech 2 is the better, improved version of Deep Speech! (lets say its like Mark II compared to the original Mark I). 

# What is the Problem With Traditional Speech Recognition???

Automatic Speech Recognition (ASR) is the task of converting an audio signal into text. (Input would be our audio sample and output would be the text!)

The entire pipeline - its like Speech to an Audio signal, then to a Speech representation (spectrogram). On this representation, we would do Acoustic modeling (mapping sounds to phonemes), then Pronunciation modeling ( mapping phonemes to words), onwards to Language modeling (predicting the most likely word sequence), onto our Decoding part ( finding the best-scoring sequence) and the finally text (“hello world”)

Traditional ASR systems contained many hand-engineered components. This made the building of the entire system extremely complicated. 

Different environments, speakers and languages would require different engineering decisions.

These traditional systems contained components such as feature extraction, acoustic models, pronunciation models, language models and speaker adaptation. Building and tuning all of these components becomes particularly difficult when trying to create a system for a new language or a new environment. 

![image.png](Deep%20Speech%202%20End-to-End%20Speech%20Recognition%20in%20Eng/image%201.png)

Deep Speech 2 takes a pretty different approach.Instead of explicitly engineering all of these intermediate representations, the system learns a mapping of Audio to Text. 

The neural network will receive all the relevant speech features and directly predicts characters/words. (Btw, this was approached in the earlier deep speech paper. THis one is just the better one with newer and better techniques, more data and so on.)

The paper doesn’t want to build a system that is like for an incredibly specific english dataset and that’s it. On other datasets(or unseen data/accent), it might fail. 

The system must be able to handle everything, the conversational speech (the uh, the eh in between), all sorts of background noises (even other people talking in the background! they should be ignored!), different speakers (all sorts of pitches, gender, age, accent etc.) 

And ideally, it should be the same general approach to work across these settings with minimal language-specific engineering.

# So What Does Speech Look Like to the Network?

We send the raw audio, and the raw audio waveform is converted into a **spectrogram**.

A spectrogram represents how the energy of different frequencies changes over time.

![image.png](Deep%20Speech%202%20End-to-End%20Speech%20Recognition%20in%20Eng/image%202.png)

Source - https://www.researchgate.net/publication/36710148_Application_of_language_technologies_in_biology_Feature_extraction_and_modeling_for_transmembrane_helix_prediction#full-text

Each time step contains the power associated with different frequency bins.

Each utterance is a time-series of length where every time-slice is a vector of audio features:

$$
x^{(i)} = \left(x_0^{(i)}, x_1^{(i)}, \ldots, x_{T^{(i)}-1}^{(i)}\right)
$$

where

$$
t = 0, \ldots, T^{(i)}-1
$$

The network's job is to convert the variable-length sequence into a transcription.

However, immediately a problem arises. The audio sequence might contain hundreds or thousands of time steps, while the final transcription could contain only a few dozen characters. There is no obvious one-to-one alignment.

Suppose someone says hello. The audio contains a large number of frames, but the output only contains ‘h’, ‘e’, ‘l’, ‘l’ and ‘o’. 

Which audio frames correspond to h??

Which correspond to e??

What about the silence between words?

The authors solve this using **Connectionist Temporal Classification (CTC).** 

# CTC: How Do You Train Without Knowing the Alignment??

![image.png](Deep%20Speech%202%20End-to-End%20Speech%20Recognition%20in%20Eng/image%203.png)

THe entire process of the training of supervised sequence model would be a lot easier if we knew exactly which input frame corresponded to which output character. 

For speech recognition, this would mean manually annotating something like:

> "Frames 1–12 correspond to `h`, frames 13–25 correspond to `e`, frames 26–40 correspond to `l`..."
> 

Doing this for every utterance would be extremely expensive and would go against our general idea of building a model that can generalise well without “that” much level of effort. 

**CTC (Connectionist Temporal Classification)** gets around this by removing the need for frame-level alignment labels.

Instead of predicting one character for the entire utterance that we may have mapped in the training data, the network will produce a probability distribution over the possible output symbols at **every time step.** 

And then, we can select the character with the most probability!

For example, at one time step the network might output:

```
a     0.02
b     0.01
...
h     0.73
...
_     0.18
```

## The Alignment Part of the CTC!

The key idea behind CTC is that the network does **not** directly predict the final transcription.

Instead, a sequence of **alignments** for the total time is predicted where every position can contain either a character or the blank symbol.

Suppose the target transcription is ‘hello there’. 

![image.png](Deep%20Speech%202%20End-to-End%20Speech%20Recognition%20in%20Eng/image%204.png)

One possible CTC alignment could be:

```
_ h h _ e _ l _l _ o _ t _ _ h h _ e r _ _ e
```

Another could be:

```
h _ _ e e _ l _ l o o t _ h h _ e r _ _ e
```

Both represent the same transcription!

The important idea is that **we don't have to decide which alignment is correct during training**.

If several alignments could plausibly produce the transcription, CTC allows all of them to contribute.

The reason is that CTC has a collapse operation. 

![image.png](Deep%20Speech%202%20End-to-End%20Speech%20Recognition%20in%20Eng/image%205.png)

The collapse operation does two particular things that are very intuitive to think about - 

1. **We will merge the  consecutive repeated labels**
2. **Remove all blank symbols since no character was spoken at that time.** 

So:

```
_ h h _ e _ l l _ o _
```

becomes:

```
h e l o
```

after merging the repeated `h` and `l` and removing the blanks.

There is an important detail here.

If we want to produce repeated characters such as the two `l`s in:

```
hello
```

the two `l`s cannot simply appear consecutively in the alignment because consecutive identical labels are collapsed.

So an alignment such as:

```
h e l l o
```

would collapse to:

```
h e l o
```

Instead, CTC can use a blank to separate them:

```
h e l _ l o
```

which collapses to:

```
h e l l o
```

This is one of the main reasons the blank symbol exists.

# The Basic Deep Speech 2 Architecture

![image.png](Deep%20Speech%202%20End-to-End%20Speech%20Recognition%20in%20Eng/image%206.png)

Deep Speech is a RNN based system. Remember, there were no transformers or pure attention based architectures. 

We will take a speech spectrogram (our speech representation), progressively extract useful acoustic features with convolutional layers, model the temporal structure with recurrent layers and finally predict characters using a fully connected output layer and CTC.

The important thing is that **this is not one fixed architecture**.

The authors explore different combinations of convolutional and recurrent layers. They vary the number of convolutional layers from **1 to 3** and the number of recurrent or GRU layers from **1 to 7**. Their deepest models contain **up to 11 layers**.

At the bottom, the network receives the **spectrogram** of the speech signal. The convolutional layers operate on these acoustic features first. Depending on the architecture, these can be **1D or 2D invariant convolutions**.

Why is the convolution before the RNN??? What is even the need for convolutions?

Speech’s structure uses both the values of time and frequency and the spectrogram contains useful local patterns in both dimensions to guess the exact character. 

To extract the initial features, we make use of the convolutional layers before letting the RNN layers process the entire structure temporally and in a better way.  

There are two ways to use convolution in this architecture - 

1. **1D convolutions** which operate primarily across time. 
2. **2D convolutions** which can also capture local patterns across frequency. 

It was found that deeper 2D convolutional stacks were more helpful on noisy speech compared to 1D convolution which does suggest that early spectral processing makes the subsequent recurrent layers more robust to acoustic variation. (more variance in the audio samples should not lead to different transcripts). 

The convolutional layers can also use **striding** to reduce the number of time steps passed into the recurrent stack. This is pretty useful because recurrent computation becomes increasingly expensive as the sequence gets longer. 

![image.png](Deep%20Speech%202%20End-to-End%20Speech%20Recognition%20in%20Eng/image%207.png)

After convolution comes the main sequence-processing component, the **bidirectional recurrent stack**. The paper experiments with both standard RNNs and **GRUs** with deeper models stacking several recurrent layers. A forward RNN processes the speech from left to right while a backward RNN processes it from right to left, allowing the representation at each time step to incorporate both past and future context:

This is particularly useful for speech because the acoustic evidence surrounding a sound can help determine what that sound actually represents. (what comes before and after a certain utterance helps a lot to determine the probabiliy distribution of the utterance). 

 The recurrent layers therefore take the locally processed features from the convolutional stack and build increasingly contextual representations before passing them to the final fully connected and CTC layers.

However, not everything is sunshine and rainbows!

Several problems are still there at the time. 

Deep RNNs are difficult to optimize. The network has many recurrent layers, long sequences and thousands of hours of training data. Simply stacking more RNN layers does not automatically make the model better.

This is why the paper introduces several techniques around the architecture itself, most importantly **Batch Normalization for deep RNNs, SortaGrad, and temporal striding**.

# Simple RNN vs GRU

You would normally expect a more complex recurrent unit to perform better. (instinctively, we do thik that if something is more complex, then it must be better.)

GRUs have gates that control how information is updated and forgotten.

The gates give the model more control over how much previous information should be retained.

And on the smaller experiments, GRUs do indeed perform better.

![image.png](Deep%20Speech%202%20End-to-End%20Speech%20Recognition%20in%20Eng/image%208.png)

For example, with approximately 38 million parameters, the 9-layer architecture achieves:

```
Simple RNN:  9.52% WER
GRU:         8.19% WER
```

But, then we increased the model size!

At around 100 million parameters, the simple RNN slightly overtakes the GRU:

```
100M GRU:  7.78% WER
100M RNN:  7.73% WER
```

The simple RNN is also faster to train. Therefore, simple RNNs are used for most of their later large-scale experiments.

# BatchNorm here to save the day… :)

We want to train networks with many recurrent layers because huge amount of data has to be processed. (We always want to go for higher and higher values, not matter what it does. But its not easy to optimize the deep recurrent networks at all. :(

Lots of senstivity issues occur in deep RNNs, mainly due to numerical and optimization issues. 

**Batch Normalization was introduced for RNNs** to address this.

The usual Batch Normalization transformation is:

$$
B(x)= \gamma \frac{x-\mathrm{E}[x]} {\sqrt{\mathrm{Var}[x]+\epsilon}} + \beta
$$

The idea is that we will normalize activations using statistics calculated over the minibatch but simply dropping BatchNorm into an RNN is not straightforward.

Why? Because an RNN is sequential. The hidden state at time t depends on the previous hidden state.

So if we normalize every time step independently, we aren't necessarily solving the underlying optimization problem. 

So, we will use sequence wise normalisation. 

Instead of normalizing the entire recurrent transformation, they normalize the input-to-hidden transformation.  The recurrent state transition itself is left outside the BatchNorm transformation.

It is helping stabilize the part of the computation that receives the current input and the deeper the network becomes, the more useful this normalization will become.

With a fixed parameter budget, the authors observe increasingly large gains from BatchNorm as the number of recurrent layers increases. For their deepest tested network, the development WER improves from **10.83% to 9.52%**. (wer is word error rate, lower means better. )

# Onto SortaGrad and Striding!

Speech utterances have very different lengths and longer sequences make CTC training harder. Sortagrad comes into play then. 

During the **first training epoch**, utterances are presented in increasing order of length. SHort, Medium and Long. 

After that, the training examples are shuffled normally.

The intuition is very, very simple. (same as a teaching strategy for students). We will start the network with easier examples before exposing it to long, difficult sequences. The authors found that this improves optimization, particularly during the early stages of training. 

For the 9-layer model with Batch Normalization, adding SortaGrad improves development WER from **9.78% to 9.52%**. Without Batch Normalization, the improvement is considerably larger.

Now, for striding. 

Speech contains a huge number of time steps, and recurrent layers have to process them sequentially. **Striding** will help reduce this sequence length before it reaches the recurrent stack.

For example, a stride of 2, means to skip ebery other sequence unit. 

Fewer time steps means fewer recurrent computations and therefore lower computational cost but we have to make sure the stride value is okayish. If we downsample too aggressively, it can also remove information needed for transcription.

This tradeoff is especially important because English and Mandarin have very different character rates. In the authors' training data, English contains roughly **14.1 characters per second** compared with only **3.3 characters per second for Mandarin**.

So the amount of temporal compression that works well for one language may not work equally well for another.

# Why Predict Bigrams Instead of Characters?

Instead of predicting every character individually:

```
t h e   c a t   s a t
```

the English system can predict **non-overlapping character bigrams**:

```
th e_ ca t_ sa t
```

We represent more characters with each output symbol. This reduces the number of output time steps required and therefore allows the network to use **larger temporal strides** without losing as much transcription information.

The experiments show the benefit clearly. At stride 4, the unigram model achieves a WER of **18.86%** without a language model, compared with **14.84%** for the bigram model. With the language model, the gap becomes Unigram is 11.92% and Bigram is 9.93%. 
Compact output representation can lead to lesser computation and memory while reducing the transcription accuracy. 

LANGUAGE MODEL TIME!

![image.png](Deep%20Speech%202%20End-to-End%20Speech%20Recognition%20in%20Eng/image%209.png)

A question for you, if the neural network can directly predict everything? Then, whats the need for a language model??

(Btw, a language model is a model that will learn the sequences of words that are likely to occur (like I love ___ ? , it will assign a higher probability to ice cream instead of bitter gourd.))

Our neural network is learning quite a bit of language structure implicitly from the millions of transcripts we have fed in it, but still handling speech is not something simple. For example, the acoustic signal alone might make it difficult to distinguish between *"I scream"* and *"ice cream"*. This is where an external **language model** helps by providing an additional preference for text sequences that are more likely in a language.

For English, the authors use a **5-gram Kneser-Ney smoothed language model** trained on the **400,000 most frequent words** from **250 million lines of cleaned Common Crawl text**. 

(Kneser-Ney smoothing is a technique for n-gram language models that assigns reasonable probabilities to words/n-grams that are rare or unseen in the training data.)

For Mandarin, they use a **character-level 5-gram language model** trained on an internal corpus containing **8 billion lines of text**. During decoding, the acoustic model and language model are combined and **beam search (this is just a way of searching that instead of only top prob, we keep like top k prob (k is beam size) and then we continuously expand, score and choose the highest scoring )** is used to efficiently search through likely transcriptions.

According to observatings, the deeper neural networks rely less on the external language model. The authors suggest that as the recurrent network becomes larger and deeper, it starts learning a stronger **implicit language model** of its own. So the network isn't only learning what speech sounds like; it is also learning some of the statistical structure of the language.

For Mandarin, the overall architecture remains largely the same. The main difference is the output vocabulary. Instead of predicting English characters, the network predicts roughly **6,000 simplified Chinese characters**, while also including the Roman alphabet because mixed Chinese-English transcripts are common. The language model is correspondingly built at the **character level** rather than the word level.

This is one of the interesting aspects of DS2: the authors don't need to completely redesign the speech-recognition system for another language. The same basic **spectrogram → convolution → recurrent layers → CTC** pipeline can be reused, with the output vocabulary and language model adapted to the language being recognized.

# Where Does All This Data Come From?

Lets talk more about the data used to train in this paper. A model this large needs a lot of speech. 

The English system is trained on approximately **11,940 hours of labeled speech which** contains around **8 million utterances** while the Mandarin system uses roughly **9,400 hours** and **11 million utterances**. The English data comes from a mixture of read and conversational speech. 

| Dataset | Speech Type | Hours |
| --- | --- | --- |
| WSJ | Read | 80 |
| Switchboard | Conversational | 300 |
| Fisher | Conversational | 2,000 |
| LibriSpeech | Read | 960 |
| Baidu | Read | 5,000 |
| Baidu | Mixed | 3,600 |
| **Total** |  | **11,940** |

This diversity matters a lot because the model shouldn't only learn what speech sounds like in a clean recording. It needs to deal with different speakers, speaking styles, accents and different background noise conditions. INternaly, the datasets also contain long audio clips of minutes and even hours, which is pretty impractical to feed into our RNN directly.  

To turn these recordings into usable training examples, the authors first use an existing **bidirectional CTC-trained RNN** to find the most likely alignment between the audio and transcript. 

The resulting alignment is then used to identify long stretches of **blank labels** which usually correspond to silence. These regions provide natural boundaries for splitting long recordings into shorter utterances. For English, the segmentation process also uses the space token to encourage **word-level boundaries** producing utterances with an average duration of roughly **7 seconds**. 

Of course, automatic alignment isn't always correct. The authors therefore build another filtering stage using **crowdsourced ground-truth transcriptions** for several thousand examples. They compare these against the automatically aligned transcripts using word-level edit distance and train a linear classifier to identify examples worth keeping. For the English data, this filtering reduces WER from **17% to 5%** while still retaining **more than half of the examples**. 

The authors also deliberately add noise during training to make the model more robust. Noise is added to **40% of randomly selected utterances** using several thousand hours of randomly selected audio clips that are combined into hundreds of hours of noise. Interestingly, adding more noise isn't always better. Too much noise makes optimization harder while too little provides insufficient exposure to noisy conditions.

The amount of training data itself has a substantial effect. When the authors train using increasing fractions of the dataset, the WER consistently decreases:

| Training Data | Hours | Regular Dev WER | Noisy Dev WER |
| --- | --- | --- | --- |
| 1% | 120 | 29.23% | 50.97% |
| 10% | 1,200 | 13.80% | 22.99% |
| 20% | 2,400 | 11.65% | 20.41% |
| 50% | 6,000 | 9.51% | 15.90% |
| 100% | 12,000 | 8.46% | 13.59% |

The trend is quite clear. More labeled speech produces substantially better recognition with the authors observing approximately a **40% relative reduction in WER for every 10× increase in training data** in this experiment. However, noisy speech remains considerably harder than clean speech even as the dataset grows.

# Now Comes the Hardware Problem

![image.png](Deep%20Speech%202%20End-to-End%20Speech%20Recognition%20in%20Eng/image%2010.png)

At this point, DS2 has **deep RNNs, millions of utterances, thousands of hours of speech, tens of millions of parameters, CTC, language models and data augmentation**. (lots of shit that needs ot be computed)

The obvious problem is that training all of this is expensive. (this is why RAMs prices getting so expensive for consumers, these companies buying all the production of RAMs that will be done in future so we stuck with higher price TT :( 

So, its very important to have efficient computation (since infinite RAM and money doesn’t exist). 

The authors estimate that training the models to convergence requires **tens of single-precision exaFLOPs (10^18)** which could translate to roughly **3–6 weeks on a single GPU**. That makes large-scale experimentation painfully slow (imagine waiting for 6 weeks for a single experiment and it turns out to be useless af.)

**We will use data parallelism then!** Across multiple GPUs, each GPU receives a different portion of the minibatch, computes its local gradients and the gradients are combined using **all-reduce (sort of an average of gradients)** before every GPU performs the same parameter update. 

We will use **synchronous SGD (Synchronous SGD** means that all GPUs **finish computing their gradients and wait for each other before updating the model**.**) instead of** asynchronous training mainly because synchronization makes experiments easier to reproduce and debug.(and everyone wants to make their life easier.)

Their scaling experiments show that the **training time per epoch approximately halves when the number of GPUs is doubled which nearly gives linear scaling.** 

However, everything is not all sunshine and daisies if we have computed on individual GPUs only. We also need to facilitate the communication. They can become a bottleneck themselves, so the authors implement their own **ring-based all-reduce**. 

![image.png](Deep%20Speech%202%20End-to-End%20Speech%20Recognition%20in%20Eng/image%2011.png)

For their common **8- and 16-GPU configurations**, this gives roughly a **2.5× speedup** over using OpenMPI (Open MPI is **an open-source Message Passing Interface (MPI) implementation used to build parallel applications for high-performance computing systems.)** directly for the full training run. 

Even **CTC decoding during training** needs optimization. The authors implement CTC directly on the GPU saving approximately **95 minutes per epoch for English** and **25 minutes per epoch for Mandarin**. Overall, this reduces training time by around **10–20%**. It might sound like a small implementation detail but when hundreds of experiments are involved, repeatedly saving a fraction of an hour quickly becomes significant.

Storing the values every epoch is important, so memory also creates a problem. 

During training, the network needs to store activations for backpropagation across both layers and time steps. For a **70-million-parameter, 9-layer network**, the weights require roughly **280 MB** while the activations for a batch of **64 seven-second utterances** require around **1.5 GB**. So the activations can consume substantially more memory than the parameters themselves.

Variable-length speech makes this even trickier because a particularly long utterance can unexpectedly push GPU memory beyond its limit. THerefore, in the paper, they have implemented their own memory allocator and a fallback mechanism that can temporarily use **page-locked CPU memory** when GPU memory is exhausted. 9very very crucial since without it, it would be much harder to train the model)

There is also a final hardware-related problem but this time it appears during **deployment**. Most of the strongest DS2 models use **bidirectional RNNs** which needs information from both past and future frames. That is excellent for offline recognition but it is awkward for real-time transcription, if the user is currently saying *"I want to...",*  the model cannot completely process the current representation without seeing what comes next.

This is where **row convolution** enters and it becomes an important part of turning DS2 from a large research model into something that can actually be used in real-time speech recognition.

# Row Convolution: A Little Future Context

As we understand and analyse a bit more, we can see that a model doesn't necessarily need access to the entire future sequence.

<!-- Instead, they give the network a small future window of size $\tau$:
\[h_{t:t+\tau} = [h_t,h_{t+1},...,h_{t+\tau}]\]
and combine these future representations using a learned weight matrix:
\[r_{t,i} = \sum_{j=1}^{\tau+1} W_{i,j}h_{t+j-1,i}\] -->
Instead, they give the network a small future window of size $\tau$:

$$
h_{t:t+\tau} = [h_t, h_{t+1}, \ldots, h_{t+\tau}]
$$

and combine these future representations using a learned weight matrix:

$$
r_{t,i} = \sum_{j=0}^{\tau} W_{i,j}h_{t+j,i}
$$
This is called row convolution because the operation is performed across each row of the feature matrix. 

This ensures that the network can mostly remain unidirectional while our final stage would sneak a peek into the future. thus, giving most of the benefit of bi directional rnn without having the entire utterance. 

# Making It Work in Real Time

The deployed Mandarin model uses 5 forward-only recurrent layers, followed by row convolution, a fully connected layer, and then CTC and beam-search decoding. The recurrent layers contain 2,560 hidden units. 

Batch Dispatch was also introduced for serving multiple users efficiently. Instead of sending every request independently to the GPU, we can just combine the incoming requests into batches so that the GPU can perform larger matrix operations. However, waiting indefinitely for a large batch would increase latency, so the system uses an eager batching strategy processing a batch as soon as the previous batch finishes. 

# Optimizing Inference

16-bit floating-point arithmetic is used during inference. Also, no measurable degradation in recognition accuracy while reducing memory and bandwidth requirements. 

TO quicken it up a bit more, custom matrix-multiplication kernels are implemented because standard BLAS(basic linear algebra subprograms) routines are inefficient for the small batch sizes common during deployment. Their specialized kernel reaches around 90% of peak memory bandwidth in these workloads.

Even beam search becomes a performance bottleneck. For Mandarin, naive decoding can require more than one million language-model lookups for every 40 ms of speech. The authors therefore prune candidates by keeping the smallest set whose cumulative probability reaches 0.99 while also limiting the number of characters considered to 40. This reduces language-model lookup time by approximately 150×, with only about 0.1–0.3% relative change in character error rate.

# So What Did the Architecture Actually Achieve?

The experiments show a fairly consistent pattern that the **depth improved recognition to a ceraint amount**. On Mandarin, the progression from a shallow 1-RNN model to a 3-RNN model then adding Batch Normalization and finally using a **9-layer network with 7 RNN layers and 2D convolutions** steadily improves performance. The deepest model reaches **5.81% CER on development data and 7.93% on the noisy test set** compared with **7.13% and 15.41%** for the shallow baseline.

The English experiments show a similar trend with model size. Increasing the network from **18M → 38M → 70M → 100M parameters** continues to reduce error. For the simple RNN models, development WER falls from **8.44% at 70M parameters to 7.73% at 100M** while noisy development WER drops from **15.09% to 13.06%**. This is a useful indication that larger models were able to make better use of the large amount of training data.

![image.png](Deep%20Speech%202%20End-to-End%20Speech%20Recognition%20in%20Eng/image%2012.png)

The improvement also transfers across accents. On VoxForge, DS2 reduces WER for all four tested accent groups: **American-Canadian: 15.01% → 7.55%**, **Commonwealth: 28.46% → 13.56%**, **European: 31.20% → 17.55%**, and **Indian: 45.35% → 22.44%**. Humans still perform better on most groups, although DS2 is approximately equal to the reported human performance on the Indian accent benchmark.

On clean CHiME speech, DS2 achieves **3.34% WER**, close to the reported human result of **3.46%**, while DS1 gets **6.30%**. Under real noise, DS2 improves dramatically over DS1 (**21.79% vs. 67.94%**) but remains behind humans (**11.84%**). With simulated noise, the numbers are **45.05% for DS2, 80.27% for DS1, and 31.33% for humans**. The important observation is that augmentation and the deeper architecture substantially improve robustness, but **real-world noise remains a significant weakness**.

The same architectural ideas also work for Mandarin despite its very different writing and pronunciation system. The deepest Mandarin model reaches **5.81% development CER and 7.93% test CER**, compared with **7.13% and 15.41%** for the shallow baseline. In one human comparison involving 100 short voice-query utterances, the system achieves **3.7% error versus 4.0% for five human transcribers**; another experiment reports **5.7% for the system versus 9.7% for a single human transcriber**.

Finally, the paper demonstrates that the model can actually be deployed rather than remaining a research prototype.

The deployed system combines **unidirectional RNNs, row convolution, 16-bit inference, Batch Dispatch, optimized matrix multiplication and pruned beam search**. Its error increases only from **5.81% to 6.10% CER** roughly a **5% relative degradation**, while achieving **44 ms median latency and 70 ms 98th-percentile latency** with 10 concurrent streams. 

That’s it, folks! Really interesting paper and the amount of optimizations done and worked upon and really cool. If you found anything wrong or lacking in this blog, then please send a comment! I would love some feedback. 

# References

1. **Amodei, D., et al. (2015).**
    
    *Deep Speech 2: End-to-End Speech Recognition in English and Mandarin.*
    
    [https://arxiv.org/abs/1512.02595](https://arxiv.org/abs/1512.02595?utm_source=chatgpt.com)
    
2. **Graves, A., Fernández, S., Gomez, F., & Schmidhuber, J. (2006).**
    
    *Connectionist Temporal Classification: Labelling Unsegmented Sequence Data with Recurrent Neural Networks.*
    
    [https://dl.acm.org/doi/10.1145/1143844.1143891](https://dl.acm.org/doi/10.1145/1143844.1143891)
    
3. **Hannun, A., et al. (2014).**
    
    *Deep Speech: Scaling up End-to-End Speech Recognition.*
    
    [https://arxiv.org/abs/1412.5567](https://arxiv.org/abs/1412.5567?utm_source=chatgpt.com)
    
4. **Cho, K., et al. (2014).**
    
    *Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation.*
    
    [https://arxiv.org/abs/1406.1078](https://arxiv.org/abs/1406.1078)
    
5. **Ioffe, S., & Szegedy, C. (2015).**
    
    *Batch Normalization: Accelerating Deep Network Training by Reducing Internal Covariate Shift.*
    
    [https://arxiv.org/abs/1502.03167](https://arxiv.org/abs/1502.03167)