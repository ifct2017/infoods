#!/usr/bin/env bash
# Copyright (C) 2025 Subhajit Sahu
# SPDX-License-Identifier: AGPL-3.0-or-later
# See LICENSE for full terms

# Run all build scripts
flags="--allow-read --allow-write"

cd tagnames
deno run $flags ./build.ts
cd ..
