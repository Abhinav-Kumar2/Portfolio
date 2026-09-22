---
title: From Chain of Thought to Tree of Thoughts
date: 2026-09-22
description: Exploring how language models reason step-by-step with Chain of Thought and branch into multiple possibilities with Tree of Thoughts.
tags: [chain-of-thought, tree-of-thoughts, llm-reasoning]
---

# From Chain of Thought to Tree of Thoughts: How LLMs Learned to Explore Their Reasoning

In recent years, Large Language Models (LLMs) have been incredibly good at the generation of text, answering the questions we give to them, writing code, destabilitizing the tech industry and even solving problems that require multiple steps of reasoning.

Just like a human!!

However, there is an important difference between generating an answer that may seem convincing and actually getting through a problem that requires several decisions that are interdependent on each other. 

Consider a simple arithmetic problem. (Simple to us! Not for these models!)

![image.png](Final_COT_&_TOT/image.png)

If I ask:

> 
> 
> 
> The cafeteria had 23 apples. If they used 20 to
> make lunch and bought 6 more, how many apples
> do they have?
> 

The answer is easy for us. 

We start with 23, remove 20 and then add 6.

23 - 20 + 6 = 9

A human naturally goes through these intermediate steps by using our thought process and utilizing our reasoning. 

But if we ask a language model to directly give the answer to such questions, there is no explicit structure requiring it to perform those intermediate operations correctly.

This was one of the problems explored by the **Chain-of-Thought Prompting Elicits Reasoning in Large Language Models** paper.

![image.png](Final_COT_&_TOT/image%201.png)

Instead of showing the model examples like:

```
Question → Answer
```

we show this to the language model:

```
Question → Reasoning Steps → Answer

```

This seems pretty cool! But it comes to our mind, that not necessarily all problems have only one way to reason these questions. Do we have to give all possible ways to solve the question??

What happens when the reasoning itself has multiple possible directions?

What if the first step we take is wrong?

A chain can only follow one path.

Here, we arrived at the Tree of Thoughts paper!

![image.png](Final_COT_&_TOT/image%202.png)

Instead of asking the model to follow one reasoning path, it allows the model to explore multiple possible paths, evaluate them and also allows the model to backtrack if the current path didn’t work. 

## 1. Why Chain of Thought Was Needed

Before Chain of Thought, one of the common ways to use a large language model was few-shot prompting.

(few-shot means that the model only learns on the basis of a few labelled examples)

We provide a few examples:

```
Question 1 → Answer 1
Question 2 → Answer 2
Question 3 → Answer 3
```

Then, we provide the model with another question and it will give the answer. 

This works pretty well when the mapping between the input and output is relatively direct and does not require many intermediate steps. 

However, reasoning problems are a much different ball game!

A mathematical word problem would require us to identify several quantities, perform multiple operations and keep track of what changed after each operation. If the model misses even one value or mistakes different values at different positions in the mathematical word problems, then the final answer would most certainly be wrong. 

![image.png](Final_COT_&_TOT/image%203.png)

The model has to somehow compress all of those intermediate decisions into one final prediction.
As you can see in the example above, the model had to compress all those reasoning steps into one final prediction so it hallucinated and gave the wrong answer. 

The Chain-of-Thought paper combined two existing ideas to resolve this issue.

The first was that generating intermediate natural language reasoning steps could help models solve arithmetic/reasoning problems. 

The second was the observation that large language models could learn tasks from a few examples placed directly inside the prompt. (few shot prompting!)

However, both ideas had their own problems. The problem was that rationale-based training could require expensive human-written reasoning examples while ordinary few-shot prompting was not particularly effective for difficult reasoning tasks.

Now, comes the question of, what if we put the reasoning steps directly inside the few-shot examples?

## Chain of Thought

Standard prompting looks like:

```
Input → Output
```

Chain of Thought changes it to:

```
Input → Chain of Thought (i.e the reasoning) → Output
```

A chain of thought is simply a sequence of intermediate natural language reasoning steps that will lead us towards the final answer.

For example, instead of showing:

```
Question:
The cafeteria had 23 apples. THey gave away 20 and buys 6.

Answer:
9
```

we can show:

```
Question:
The cafeteria had 23 apples. THey gave away 20 and buys 6.

Reasoning:
Cafeteria started with 23 apples.
After giving away 20, they have 3.
THey then buys 6 more.
Therefore,they have 9 apples at the end. 

Answer:
9
```

The model is now being shown not only **what** the answer looks like but also an example of **how the problem can be broken down and solved properly.** 

The paper used this idea by manually creating eight Chain-of-Thought exemplars for most of its arithmetic benchmarks. 

The model was then prompted with these examples without any fine-tuning.

This is important because the model itself was not being retrained at all, so no extra time was taken for any more training purposes. Prompt was being sent at inference time. 

## Why and how does a chain Help?

There are two useful ways to think about this.

First, a difficult problem can be decomposed into smaller intermediate problems and these simpler problems are solved by the language model’s primary capabilities. 

Instead of:

```
Question → Answer
```

we get:

```
Question
   ↓
Identify information
   ↓
Perform operation 1
   ↓
Perform operation 2
   ↓
Perform operation 3
   ↓
Answer
```

Each intermediate step gives the model another opportunity to process the problem and go through all the relevant information. 

This is allowing additional computation to be allocated to problems that will require more reasoning steps.

Second, the intermediate reasoning is expressed in natural language for understandin purposes. 

This idea is quite important as well since in the research paper, the alternative was tested where the model was asked to produce only a mathematical equation before the answer. They also tested giving the model extra tokens without meaningful reasoning using only the sequences of dots.

Neither reproduced the benefits of normal Chain of Thought on the harder GSM8K setting. This proves to us that the improvement is not simply because the model is producing more tokens.

The paper shows that generating these reasoning sequences improves performance. However, it is not established anywhere that the model is reasoning internally in exactly the same way a human does. The authors explicitly leave that question open.

## 4. What Did the Chain of Thought Experiments Show?

Chain of Thought was evaluated on arithmetic, commonsense and symbolic reasoning tasks.

For arithmetic reasoning, they used benchmarks including GSM8K, SVAMP, ASDiv, AQuA and MAWPS. They compared standard prompting against Chain of Thought across several language models and model sizes.

![image.png](Final_COT_&_TOT/image%204.png)

- **GSM8K** - Grade-school math word problems requiring multi-step reasoning.
- **SVAMP** - Challenging arithmetic word problems designed to test robustness to wording changes.
- **ASDiv** - Diverse arithmetic word problems covering different mathematical operations and formats.
- **AQuA** - Multiple-choice quantitative reasoning problems requiring mathematical reasoning.
- **MAWPS** - Collection of elementary math word problems with varied templates and operations.

![image.png](Final_COT_&_TOT/image%205.png)

If we look at GSM8K specially, then we can see that, with PaLM 540B, Chain of Thought achieved a SOTA performance on GSM8K at the time of the paper surpassing the previous best result from a fine-tuned GPT-3 model with a verifier.

![image.png](Final_COT_&_TOT/image%206.png)

There is also a relationship between the model size and Chain of Thought.

For smaller models, adding Chain of Thought did not necessarily help. The smaller models could produce fluent-looking but illogical reasoning chains.

The improvement became much stronger around models with roughly 100 billion parameters and above.

Another pattern that could be seen was that the more complicated the problem, the larger the benefit tended to be.

For the difficult GSM8K benchmark, performance more than doubled for the largest GPT and PaLM models in the reported comparisons. On very simple one-step problems, the improvement was pretty small or sometimes negative.

This does make sense intuitively, since if a problem has a very simple reasoning or even only one single operation, there is not much reasoning to show or expose. 

But if the problem requires five or six dependent operations then having intermediate steps becomes much more useful for us. 

## The Limitation of Chain of Thought

Chain of Thought is very useful but it only gives one single path to us.

Imagine that the model starts solving a problem like this:

```
Problem
   ↓
Thought A
   ↓
Thought B
   ↓
Thought C
   ↓
Wrong answer
```

What happens if Thought B was a bad decision?

There is no explicity mechanism provided that can backtrack to the wrong decsion and do something else, it will simply proceed further and return a wrong answer. 

Very problematic for tasks where the first decision has a large effect on everything that follows.

Consider a crossword. 

If I put the wrong word into one position, that word changes the letters available to intersecting clues.

The mistake may only become obvious several steps later.

This is the limitation that motivates Tree of Thoughts. 

## From a Chain to a Tree

The main idea behind Tree of Thoughts is very basic. Instead of forcing the model to follow one reasoning path, we will allow it to explore several different paths. 

![image.png](Final_COT_&_TOT/image%207.png)

Therefore, the Tree of Thoughts provide the reasoning space instead of only one path. 

In tree of thought, the state is shown as the original problem together with the sequence of thoughts generated so far. 

$s=[x,z_{1:i}]$ where $x$ is the original input and $z_{1:i}$ represents the thoughts generated up to the current point.

A node in the tree represents a partial solution. 

## How Tree of Thoughts Works????

The ToT framework can be understood through four steps in particular mainly. 

```
Current state
      ↓
Generate candidate thoughts
      ↓
Evaluate candidates
      ↓
Search promising states
      ↓
Continue or backtrack
```

### Generate thoughts

![image.png](Final_COT_&_TOT/image%208.png)

The model first generates several possible next steps.

For Game of 24, these might be different arithmetic operations.

For Creative Writing, these might be different writing plans.

For a crossword, these might be different candidate words.

### Evaluate thoughts

![image.png](Final_COT_&_TOT/image%209.png)

The model then needs to decide which states look promising.

The paper explores two approaches.

One is **value**, where the model assigns a value to a state.

The other is **voting**, where the model compares several states and chooses which one appears most promising.

The model not only generates like CoT but it evaluates the reasoning as well to see which one is the best choice among all given. 

### Search

Once we have several candidate states, we need a search strategy.

The paper uses Breadth-First Search and Depth-First Search. One might be able to use A* and uniform cost search as well for ToT.

![image.png](Final_COT_&_TOT/image%2010.png)

### Prune and backtrack

Bad states should not consume unlimited computation.

If a state is judged unlikely to lead to a solution, the search can stop exploring that branch.

If the current path reaches a dead end, the algorithm can go back and explore another branch.

## Search Strategies: BFS and DFS

### Breadth-First Search

Breadth-First Search explores several promising states at the same level first before proceeding further. 

Suppose we have - 

![image.png](Final_COT_&_TOT/image%2011.png)

Source - https://www.wscubetech.com/resources/dsa/dfs-vs-bfs

(These are not my illustrations.)
Instead of choosing only 1, we evaluate all three states 1,2 and 3. 

Then, we keep the most promising states and expand them further and then a set of the best states at each step is maintained. This is used for Game of 24 and Creative Writing where the search trees are relatively shallow.

### Depth-First Search

![image.png](Final_COT_&_TOT/image%2012.png)

(Same source as the BFS illustration one.)

In this, it chooses one of the nodes and pursue it as deeply as possible. If it encounters a situation, where it evaluates that node, lets say node 4 to be wrong. Then, it will backtrack to the parent node like node 1 and then pursue other directions. 

This is particularly useful for Mini Crosswords, where a partial solution can become invalid several steps later. A value threshold is used in the research paper to prune states and then backtracks to the parent state when necessary.

![image.png](Final_COT_&_TOT/image%2013.png)

## Experiment: Game of 24

![image.png](Final_COT_&_TOT/image%2014.png)

Game of 24 is meant to be a game that will expose the weakness of a single reasoning path.

The task gives four numbers and asks the model to use arithmetic operations to produce 24.

For example, 4,9,10,13. 

One valid solution is (10−4)(13−9)=24

Since, there are many operations we can do at the start. We do definitely need a search space to work upon. 

The ToT paper tested 100 relatively difficult Game of 24 problems.

The results were this - 

![image.png](Final_COT_&_TOT/image%2015.png)

GPT-4 with standard Chain of Thought solved only 4% of the selected problems while ToT with a breadth of 5 solved 74%.

Why? This is because ToT can ask a different question during the solution process.

## Experiment: Creative Writing

![image.png](Final_COT_&_TOT/image%2016.png)

We now want to see if this idea is relevant outside mathematics or not?

So a Creative Writing task was created. 

The model receives four random sentences and has to write a coherent four-paragraph passage that ends with those sentences.

It is a **writing plan**.

The authors had GPT-4 generate five different plans and then vote on which plan was most promising before generating the passage.

The average coherence scores were:

![image.png](Final_COT_&_TOT/image%2017.png)

Human comparisons also preferred ToT over CoT in 41 of 100 passage pairs while CoT was preferred over ToT in 21 pairs. The remaining 38 pairs were judged similarly coherent.

## Experiment: Mini Crosswords

![image.png](Final_COT_&_TOT/image%2018.png)

Mini Crosswords make the need for backtracking even clearer.

The task uses a 5 times 5 crossword with 10 clues.

A candidate word does not exist in isolation.

Its letters constrain the answers to the intersecting clues.

So if we make a bad decision early, we might not discover the problem immediately.

The authors use Depth-First Search here. (think intuitively why??)

At every state, the model proposes candidate words. Promising candidates are explored first. If the state becomes impossible, the branch is pruned and the search returns to an earlier state.

## My Final Chain of Thoughts… :)

Now, onto some Ablation Study! We will now remove important parts of the ToT process and see how the performances look like now. 

This is useful because we don’t want it be simply that ToT works because it uses more computation.

For Mini Crosswords, removing pruning reduced the solved-game rate from 20% to 5%.

Removing backtracking also reduced it to 5%.

The improvement is not simply caused by generating a larger number of possible answers. The model needs a way to decide which paths are promising and a way to recover when a path turns out to be wrong.

Unfortunately, not everything is sunshine and rainbows in this world. There is an obvious tradeoff with basic prompting and CoT/ToT prompting. 

Standard prompting requires one main generation, Chain of Thought produces a longer sequence and Tree of Thoughts can require several generations and evaluations. 

Also, ToT is not always extremely better compared to other techniques 

On GSM8K, GPT-4 achieved 51% with IO, 86% with CoT and 90% with ToT. On StrategyQA, the corresponding results were 73%, 82% and 83%.

![image.png](Final_COT_&_TOT/image%2019.png)

The improvements are much smaller than the dramatic 4% to 74% difference on Game of 24.

ToT becomes particularly interesting when the problem itself requires exploration, planning or recovery from bad decisions.

Some limitations introduced by these two approaches. 

For Chain of Thought, the generated reasoning can be incorrect as well. ALso, the benefits depend a lot on model scale. Smaller models can generate fluent reasoning that is nevertheless logically incorrect.

Tree of Thoughts introduces another limitation. It requires substantially more inference computation because the model is generating and evaluating multiple candidate states.

Its performance also depends on the quality of the thought generator and the state evaluator. A poor evaluator can cause the search to discard a useful path.

A poor thought generator may never produce the path that leads to the solution in the first place.

**Ultimately, it can be seen that changing the inference procedure can change what a language model is able to solve.**

## References

1. Jason Wei et al. **Chain-of-Thought Prompting Elicits Reasoning in Large Language Models.** [arXiv:2201.11903](https://arxiv.org/abs/2201.11903)
2. Shunyu Yao et al. **Tree of Thoughts: Deliberate Problem Solving with Large Language Models.** arXiv:2305.10601, 2023. [arXiv:2305.10601](https://arxiv.org/abs/2305.10601)
3. https://github.com/princeton-nlp/tree-of-thought-llm - Official Repo of Tree of Thought