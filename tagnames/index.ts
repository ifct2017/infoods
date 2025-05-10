// Copyright (C) 2025 Subhajit Sahu
// SPDX-License-Identifier: AGPL-3.0-or-later
// See LICENSE for full terms
import * as csv  from "jsr:@std/csv@1.0.5";
import lunr from "npm:lunr@2.3.9";  // @deno-types="npm:@types/lunr@2.3.7"
import {type RowData, type SetupTableOptions, setupTable} from "jsr:@nodef/extra-sql@0.1.2";




//#region TYPES
/** Details of a tagname (abbreviated food component). */
export interface Tagname {
  /** Tagname code (abbreviation), e.g., AAA. */
  code: string;
  /** Name of the food component, e.g., "amino acids, total aromatic". */
  name: string;
  /** Synonyms for the food component. */
  synonyms: string;
  /** Unit of measure for the food component, e.g., mg, g, IU. */
  unit: string;
  /** Tables where the food component is found, e.g. "USDA 523, EA, SWD". */
  tables: string;
  /** Comments about the food component. */
  comments: string;
  /** Examples for the food component. */
  examples: string;
};
//#endregion




//#region GLOBALS
let corpus: Map<string, Tagname> | null = null;
let index: lunr.Index | null = null;
//#endregion




//#region FUNCTIONS
/**
 * Load the tagnames corpus from CSV file.
 * @param file CSV file path
 * @returns tagnames corpus
 */
async function loadFromCsv(file: string) {
  const map  = new Map<string, Tagname>();
  const data = await (await fetch(file)).text();
  const records = csv.parse(data, {skipFirstRow: true, comment: "#"});
  for (const r of records) {
    for (const k in r)
      r[k] = r[k].replace(/\\n|\r\n/g, "\n").trim();
    map.set(r.code, r as unknown as Tagname);
  }
  return map;
}


/**
 * Setup the lunr index for the tagnames corpus.
 * @returns lunr index
 */
function setupIndex(corpus: Map<string, Tagname>) {
  return lunr(function(this: lunr.Builder) {
    this.ref('code');
    this.field('code', {boost: 3});
    this.field('name', {boost: 2});
    this.field('synonyms', {boost: 2});
    // this.pipeline.remove(lunr.stopWordFilter);
    for (const {code, name, synonyms} of corpus?.values() || [])
      this.add({code, name: name.replace(/\W/g, ' '), synonyms: synonyms.replace(/\W/g, ' ')});
  });
}


/**
 * Load the tagnames corpus from the file.
 * @returns tagnames corpus
 */
export async function loadTagnames(): Promise<Map<string, Tagname>> {
  if (corpus) return corpus;
  corpus = await loadFromCsv(tagnamesCsv());
  index  = setupIndex(corpus);
  return corpus;
}


/**
 * Get the path to the tagnames CSV file.
 * @returns CSV file URL
 */
export function tagnamesCsv(): string {
  return import.meta.resolve('./index.csv');
}


/**
 * Obtain SQL command to create and populate the tagnames table.
 * @param tab table name
 * @param opt options for the table
 * @returns SQL command
 */
export async function tagnamesSql(tab: string="tagnames", opt: SetupTableOptions={}): Promise<string> {
  return setupTable(tab, {code: "TEXT", name: "TEXT", synonyms: "TEXT", unit: "TEXT",
    tables: "TEXT", comments: "TEXT", examples: "TEXT"}, (await loadTagnames()).values() as Iterable<RowData>,
    Object.assign({pk: "code", index: true, tsvector: {code: "A", name: "B", synonyms: "C"}}, opt));
}


/**
 * Get the details of a tagname (abbreviated food component).
 * @param txt text to search for
 * @returns `{code, name, synonyms, unit, tables, comments, examples}` if found, null otherwise
 */
export function tagnames(txt: string): Tagname[] {
  if (index == null) return [];
  const a: Tagname[] = []; txt = txt.replace(/\W/g, ' ');
  const mats = index.search(txt); let max = 0;
  for (const mat of mats)
    max = Math.max(max, Object.keys(mat.matchData.metadata).length);
  for (const mat of mats)
    if (Object.keys(mat.matchData.metadata).length === max) a.push(corpus?.get(mat.ref) || {} as Tagname);
  return a;
}
//#endregion
