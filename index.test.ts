// Copyright (C) 2025 Subhajit Sahu
// SPDX-License-Identifier: AGPL-3.0-or-later
// See LICENSE for full terms
import {assertEquals} from "jsr:@std/assert";
import {
  abbreviations,
  loadAbbreviations,
  tagnames,
  loadTagnames,
} from "./index.ts";




Deno.test("Abbreviations", async () => {
  await loadAbbreviations();
  const a = abbreviations("GLVs");
  assertEquals(a?.full, "Green Leafy Vegetables");

  const b = abbreviations("g l v s");
  assertEquals(b?.full, "Green Leafy Vegetables");

  const c = abbreviations("what is D.R.I.");
  assertEquals(c?.full, "Dietary reference intake");

  const d = abbreviations("d. r. i. stands for?");
  assertEquals(d?.full, "Dietary reference intake");
});


Deno.test("Tagnames", async () => {
  await loadTagnames();
  const a = tagnames("vitamin c");
  assertEquals(a[0]?.code, "VITC");

  const b = tagnames("c-vitamin");
  assertEquals(b[0]?.code, "VITC");

  const c = tagnames("what is butyric acid?");
  assertEquals(c[0]?.code, "F4D0F");

  const d = tagnames("c4:0 stands for?");
  assertEquals(d[0]?.code, "F4D0");
});
