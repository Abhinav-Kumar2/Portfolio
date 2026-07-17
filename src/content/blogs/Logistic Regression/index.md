---
title: Logistic Regression: A Beginner’s Guide to Classification
date: 2025-03-23
description: A beginner-friendly introduction to logistic regression for binary classification, covering sigmoid probability outputs, decision boundaries, loss, gradient descent, and its softmax extension.
tags: [machine-learning, classification, logistic-regression, statistics]
---

## Introduction

Imagine you are a college student trying to decide whether to attend the 8 AM class tomorrow morning. You consider a few key factors: your current attendance percentage, how tired you feel, and whether the course is important enough (on a scale of 1-10 using your intuition). Probably, the most important factor is your attendance, if it’s below 75%, unfortunately you would have to go to avoid falling further behind. If it’s above 75%, you can decide to skip and catch up on sleep. This decision-making process is similar to how logistic regression works—it helps us predict outcomes (categories) based on certain criteria.

In the field of machine learning, logistic regression is an algorithm that is used to predict the probability of an event happening. Unlike linear regression, which predicts continuous outcomes (like house prices), logistic regression is used when the outcomes are countable i.e it has finite possible results, primarily it is the basis for binary classification.

Using our initial example, 

In logistic regression:

- The **factors** (attendance percentage, no. of hours you have slept, importance of the course) are the input variables.
- The **decision** (attend or skip) is the binary outcome.
- The **75% attendance rule** is the threshold that determines the outcome.

But here’s the twist: instead of giving a straight yes/no answer, logistic regression gives us the *probability* of the outcome. For example, it might tell us there’s a 90% chance the student will attend class if their attendance is 70%, but only a 30% chance if their attendance is 80%.

## **Understanding Logistic Regression**

It’s imperative that you don't let the name of the algorithm fool you. Despite it’s name having “regression” in it, the algorithm is actually used to solve classification tasks. However, the underlying mechanism is actually performing regression. We will see this in detail later on. Let us proceed with an example to study logistic regression.

Let’s say we want to differentiate between two species of the iris flower- Iris Virginica and Iris Versicolor.

![image.png](image.png)
Iris Virginica (Above)

![image.png](image%201.png)
Iris Versicolor

We have been given specifications for 100 flowers; 50 for each species. These specifications include the Petal Length, Petal Width and finally, the species of the flower.

![image.png](image%202.png)

(Fig 1) This is a scatter plot representing our 2D dataset.

We want to train our model such that if it’s given the flower’s petal width and lengths, it can accurately predict what species the flower belongs to.

We have the species defined for all 100 flower specimen. Since each data point has been provided with its label, this is *supervised classification*. Also, since we only have 2 possible classes- Virginica and Versicolor, our task will be to perform *binary classification*.

When it comes to classification, roughly, a classifier will try to find a decision boundary that best separates the given classes.

In our case, a “perfect” decision boundary may look somewhat like this-                                     

![image.png](image%203.png)
Decision Boundary in Red

However, this decision boundary seems like it is overfitting (the model fits too closely to the training data making it hard for it to predict for the new data) the dataset. This is clear from the fact that the black datapoints of versicolor flowers lie pretty far from the normal versicolor region. In order to prevent overfitting, we can reduce the degree of freedom of the classifier. Let us try to fit a much simpler decision boundary to this dataset.

![image.png](image%204.png)
This looks much better! Even though we are wrongly classifying some data points, many of them are most probably outliers and will be removed from the dataset. Most of the data points are being correctly classified just by a linear fit.

Conveniently, Logistic Regression also produces a linear decision boundary! So, this classifier looks well suited for this task. Let us now get into the meat and bones of Logistic Regression and define it using mathematics.

# Logistic Regression

Logistic Regression is an algorithm used for binary classification. It produces a linear decision boundary. It takes a weighted input of all parameters of the dataset and passes it through a special function known as **the Sigmoid Function(AKA Logistic Function)**. The output of this function gives us the probability of each data point belonging to class 1.(In binary, one arbitrary class would be denoted 0 while the other will be 1)

A threshold is then applied to the output of this function. Values above the threshold will be in one class while values below the threshold will be in another class. Since we are dealing with probabilities, Values above 0.5 will be considered 1 and below will be considered 0.

![image.png](image%205.png)
Here, $\sigma(t)$ is the sigmoid function where t is the input of weighted parameters we give. The threshold is the line x=0.

Seems complicated, doesn’t it? Let’s break it down.

# **1) Computing the probability**

First, we prepare the weighted inputs.

Our dataset looks somewhat like this- 
![image.png](image%206.png)

We have two features, petal_length and petal_width. The species column will act as the labels for our dataset.

- **Common Terminology**
    
    First of all, let’s introduce ourselves to some common terminology which will be use throughout the blog post.
    
    m is the total no. of instances/ data points.
    
    $X$ is our feature matrix which we’ll train our model on.
    
    $y$ is our labels for the given dataset.
    
    $\theta$ is the parameter vector.
    
    $\hat y$ is the predicted labels
    
    First of all, we will compute a **weighted sum of the parameters.** This can be done efficiently by computing the matrix multiplication of the input features with the parameter vector, instead of running it element-wise in a loop. This is because it’s much more efficient to perform multiple parallel computations at once instead of performing one computation at a time.
    
    $$
    S = X\theta
    $$
    
    $\bold X$ is our feature matrix consisting of petal_length and petal_width. It has been concatenated by a row of ones in order to facilitate for a bias term.
    
    $\theta$ is the weight matrix, consisting of weights $\theta_1$,$\theta_2$**, b**. $\theta_1$ and $\theta_2$ correspond to petal_length and petal_width respectively while **b** is simply a bias term added in order to increase the degrees of freedom of the model. Initially, it will be initialized with random values which will be tweaked as the model learns the dataset.
    
                                                                             
    
    ![Screenshot from 2025-03-05 15-53-33.png](Screenshot_from_2025-03-05_15-53-33.png)
    $\bold X$ looks like this (Above)


    ![image.png](image%207.png)
    $\theta$ looks like this

    Initially, all three parameter values are randomly initialized.
    
    Now, This vector S is inputted into the sigmoid function.This will give us a vector the shape of S, but each element will have the sigmoid computed on them. This vector represents the probability of each data point belonging to the 1 class.
    

# 2) Predicting the class

Predicting the class is as simple as setting the threshold to 0.5 and predicting all data points with probability p ≥ 0.5 as 1 and p < 0.5 as 0. **Let us assume 1 is Virginica and 0 is Versicolor.**

$$
\hat{y} = \begin{cases}
0 & \text{if }\hat{p} < 0.5 \\
1 & \text{if }\hat{p} \geq 0.5
\end{cases}
$$

# 3)Finding the loss and training our model

Till now, we haven’t talked at all about how the loss for each training sample will be computed. Finding the loss is essential if we want to train our model. Let us look at one possible way to get loss.

$$
L(\theta)=\begin {cases} -y^{(i)}log(\hat p^{(i)})  \text { | if } y^{(i)}=1 \\ -(1-y^{(i)})log(1-\hat p^{(i)}) \text{ | if }y^{(i)}=0 \end {cases} 
$$

$y^{(i)}$ is the **actual value** for the i’th instance.

$\hat p^{(i)}$ is the i’th instance’s **predicted** **probability.**

If $y^{(i)}=1$ , we get $log(\hat p^{(i)})$. The loss will be close to 0 if the probability is close to 1 and vice versa. So, this part punishes low probabilities.
Similarly, when $\hat y^{(i)}=0$. By similar reasoning, loss will be close to 0 if probability is close to 0 and high if probability is close to 1.

Now, this piecewise function can be converted into a single function. This function is known as the **Log Loss/ Binary Cross Entropy**

In the case of Logistic Regression, we use the **Binary Cross Entropy(AKA Log Loss).**

$$
J(\theta) = -\frac{1}{m}\sum_{i=1}^m[y^{(i)}\log(\hat{p}^{(i)}) + (1-y^{(i)})\log(1-\hat{p}^{(i)}))]
$$

This function has the neat property of being **convex.** So, Gradient Descent (or any other
optimization algorithm) is guaranteed to find the global minimum (given that the learning rate is properly tuned and you wait long enough).

$$
\nabla_\theta(J(\theta)) = \frac 1 m (\sigma(X\theta)-y)^T\cdot X
$$

The partial derivative of the cost function is given above. You may notice that it is **very** similar to the one for linear regression. This partial derivative can now be used with Gradient Descent in order to tweak the parameters.

That’s it! That covers all of the basics you need to know about logistic regression. Now, you should try to implement it yourselves in python using Gradient Descent. The code is very similar to that of Linear Regression using GD, so if you’ve already done that, it shouldn’t be too hard to implement this.

Here, we train the model for **100 epochs** with a **learning rate of 0.5**. Then, we use the learned `theta` to make predictions and apply a **threshold of 0.5** to classify the outputs as either **0 or 1**.

Training it on the iris dataset and testing it on the same yields an accuracy of 97.3%. The Jupyter Notebook for the entire code is attached for your reference. 

The linear decision boundary generated is given below.

![image.png](image%208.png)

The **black line** is the initial boundary generated by the randomized theta parameter.

The **red line** is the final boundary generated after training the dataset.

## Softmax Regression

The Logistic Regression model can be generalized to support multiple classes directly,
without having to train and combine multiple binary classifiers.

If we have an instance $\bold x$, the Softmax Regression model first computes a score $s_k(\bold x)$ for each class **k**, then estimates the probability of each class by applying the softmax function to the scores.

The **argmax (highest probability)** of these probabilities is taken row-wise in order to get the predicted class.

**Score Function-**

$$
s_k(\bold x)= \bold x \theta^{(k)}
$$

Here, **k** refers to the parameter vector for the k’th class.  $\Theta$ contains parameters of all classes stored column wise. So, the k’th class will have its parameters stored in it’s corresponding column. This column is denoted by $\theta^{(k)}$ 

**Softmax Function-**

$$
\hat{p}_k = \sigma(s(\mathbf{x}))_k = \frac{\exp(s_k(\mathbf{x}))}{\sum_{j=1}^{K} \exp(s_j(\mathbf{x}))}
$$

K is the number of classes. 
• $s(\bold x)$ is a vector containing the scores of each class for the instance $\bold x$.
• $\sigma(s(\bold x))_k$ is the estimated probability that the instance $\bold x$ belongs to class k, given
the scores of each class for that instance.

• $s_i{(\bold x)}$ means the Scores associated with i’th class.

The function looks complicated, but essentially what it does is it takes a row from the scores matrix, computes the exponential of the entire row and then divides all of the elements in that row by the sum of all exponentials of that row in order to restrict the values to 0-1.

For example- Let’s say our row is [0.67,1.22,-0.43].

First, we take the exponential of all 3 elements to get [1.954,3.387,0.650].

Now, sum over all elements to get 5.991.

Finally, we divide all elements by the sum to get [0.326,0.565,0.108]. This is our final predictions for the probabilities.

$$
\hat{y} = \arg\max_k \sigma(s(\mathbf{x}))_k = \arg\max_k s_k(\mathbf{x}) = \arg\max_k ( \mathbf{x} (\boldsymbol{\theta}^{(k)}) )
$$

This is an interesting relation between the argmaxes of the output of the softmax function and the scores. This holds true because computing the softmax function on elements doesn’t change the relative ordering between the elements. the smallest will remain the smallest and so on. 

Hence, we can directly take the argmax of the **scores** in order to get predictions.

# Drawbacks of Softmax Regression

Softmax Regression cannot be used in **multilabel classification**. This means that it can classify an instance only into one class, not into multiple classes. This is evident from the fact that the sum of probabilities for a data point is equal to 1. If two relevant classes are present, then only one will be expressed since two classes cannot have a high probability (Say 0.9,0.8).

# Conclusion

Hope you enjoyed our blog on **Logistic Regression**. From understanding the intuitive idea of classification, explore the math behind it to the implementation of Logistic Regression, we have covered all necessary parts of Logistic Regression. Logistic Regression acts as a powerful tool for numerous scenarios whether we are deciding to attend the morning class or identifying flower species. 

We also dived through **Softmax Regression**, an extension in the field of classification dealing with multiple classes. Now, that we have shone light on these topics, you can make use of tools such as scikit-learn and attempt to implement them in different situations, or you can go for writing them from scratch if you are interested in the logic behind the functions. 

Even though, Logistic Regression is one of the simpler topics in the realm of Machine Learning, it is an important stepping stone to explore more advanced topics in the future. 