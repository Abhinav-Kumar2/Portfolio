---
title: A Quiet Setup for Reproducible Training
date: 2025-01-28
description: Notes on the small, boring infrastructure choices that make ML experiments survive contact with reality.
tags: [tooling, mlops, notes]
---

Most of the time spent on a training run isn&apos;t the training. It&apos;s the small
infrastructure around it — config, logging, checkpointing, the thirty seconds
of staring at a tensorboard plot before realizing you forgot to set the seed.

Here is the setup I keep returning to.

## One config object, top to bottom

I use a single dataclass for everything the run depends on. No mutable globals,
no environment variables sneaking into the model.

```python
from dataclasses import dataclass, asdict

@dataclass(frozen=True)
class Config:
    model: str = "gpt2-small"
    lr: float = 3e-4
    batch_size: int = 32
    seed: int = 0

    def hash(self) -> str:
        import hashlib, json
        return hashlib.sha1(json.dumps(asdict(self), sort_keys=True).encode()).hexdigest()[:8]
```

The hash becomes the run directory name. Two runs with the same hash are
guaranteed to be the same run.

## Checkpoint *everything*, including the config

A checkpoint without its config is a paperweight. I always save them together:

- `checkpoint.pt` — weights, optimizer, scheduler, RNG state
- `config.json` — the dataclass, serialized
- `metrics.jsonl` — one line per logging step

That last one is underrated. `jq` over a `.jsonl` file beats most dashboards.

## Make the boring things impossible to forget

- Seed `torch`, `numpy`, *and* `random`, then log all three.
- Pin every dependency. No `>=`.
- Print the git SHA at the top of every run. If it&apos;s dirty, refuse to start
  unless `--allow-dirty` is passed.

None of this is interesting. That&apos;s the point. The interesting work happens
on top of a quiet, boring foundation.
