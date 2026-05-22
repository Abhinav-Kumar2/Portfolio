---
title: On Attention as a Soft Lookup
date: 2025-03-12
description: A careful walk-through of attention as a differentiable dictionary, and why that framing makes interpretability tractable.
tags: [transformers, interpretability, theory]
---

The clearest way I&apos;ve found to think about attention is as a **soft, differentiable
dictionary lookup**. You have keys, you have a query, and instead of returning
exactly one value you return a weighted blend. Everything else — multi-head,
positional encoding, causal masking — sits on top of that single idea.

## The mechanism

Given a query $q$, keys $K$ and values $V$:

```python
import torch
import torch.nn.functional as F

def attention(q, K, V):
    # q: (d,), K: (n, d), V: (n, d_v)
    scores = K @ q / (q.shape[-1] ** 0.5)   # (n,)
    weights = F.softmax(scores, dim=-1)     # (n,)
    return weights @ V                       # (d_v,)
```

That&apos;s the whole thing. The softmax is the part that makes it *soft* — every
key gets some weight, but the distribution can be very sharp.

## Why this framing helps

When you stop thinking of attention as a magic box and start thinking of it as
a lookup table, three things become easier:

- **Inspection.** Attention weights are just a probability distribution over
  tokens. You can plot them.
- **Editing.** Want to ablate a head? Replace its output with the mean over the
  batch and see what changes.
- **Reasoning.** Most interpretability findings boil down to "this head reads
  position X and writes feature Y."

> The model is doing linear algebra. The hard part is figuring out which basis
> it chose.

## A small table of common patterns

| Pattern               | What you see              | What it usually means        |
| --------------------- | ------------------------- | ---------------------------- |
| Diagonal              | $w_{ii} \approx 1$        | Identity / copy              |
| Previous token        | $w_{i, i-1} \approx 1$    | Bigram-ish circuit           |
| BOS-dominant          | $w_{i, 0} \approx 1$      | "Null op" — head is idle     |
| Long-range, sparse    | Spiky off-diagonal        | Induction or factual recall  |

That&apos;s really it for today. The fun starts when you compose heads across
layers — but that&apos;s a longer post.
