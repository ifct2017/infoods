<!-- Copyright (C) 2025 Subhajit Sahu -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->
<!-- See LICENSE for full terms -->

Kit for International Network of Food Data Systems ([INFOODS]).

This package provides utilities for accessing standardized food composition data, including abbreviation resolution (e.g., expanding `GLVs` to `Green Leafy Vegetables`) and nutrient tagname lookups (e.g., mapping `vitamin C` to its INFOODS code `VITC`), with functions to load datasets, generate SQL/CSV schemas, and query terms through flexible pattern matching.

▌
📦 [JSR](https://jsr.io/@nodef/infoods),
📰 [Docs](https://jsr.io/@nodef/infoods/doc).

<br>


```javascript
import * as infoods from "jsr:@nodef/infoods";
// infoods.loadAbbreviations(): Map {key => {abbr, full}}
// infoods.abbreviationsSql([table], [options]): SQL commands to create abbreviations table
// infoods.abbreviationsCsv(): Path to csv file
// infoods.abbreviations(<query>)
// → {abbr, full} if supported, null otherwise.


await infoods.loadAbbreviations();
// Load corpus first

infoods.abbreviations('GLVs');
infoods.abbreviations('g l v s');
// → Green Leafy Vegetables

infoods.abbreviations('what is D.R.I.');
infoods.abbreviations('d. r. i. stands for?');
/* (full stops must immediately follow character, if present) */
/* (for single character abbreviations, full stop is mandatory) */
// → Dietary reference intake
```

```javascript
import * as infoods from "jsr:@nodef/infoods";
// infoods.loadTagnames(): Map {code => {code, name, synonyms, unit, tables, comments, examples}}
// infoods.tagnamesSql([table], [options]): SQL commands to create tagnames table
// infoods.tagnamesCsv(): Path to csv file
// infoods.tagnames(<query>)
// → [{code, name, synonyms, unit, tables, comments, examples}] for matched tagnames


await infoods.loadTagnames();
// Load corpus first

infoods.tagnames('vitamin c');
infoods.tagnames('c-vitamin');
// → [
// →   {
// →     code: 'VITC',
// →     name: 'vitamin C',
// →     synonyms: 'ascorbic acid; ascorbate (Note that these terms are not true synonyms but are often found in food tables to refer to vitamin C.)',
// →     unit: 'mg',
// →     tables: 'USDA 401, SFK, MW, ETH, IND, NE, EA, PRC, DAN',
// →     comments: 'L-ascorbic acid plus L- dehydroascorbic acid.',
// →     examples: ''
// →   },
// →   ...
// → ]


infoods.tagnames('what is butyric acid?');
infoods.tagnames('c4:0 stands for?');
// → [
// →   {
// →     code: 'F4D0F',
// →     name: 'fatty acid 4:0; expressed per quantity of total fatty acids',
// →     synonyms: 'butyric acid; tetranoic acid',
// →     unit: 'g/100 g fatty acid',
// →     tables: 'MW, FRN, DAN, SWD',
// →     comments: '',
// →     examples: ''
// →   },
// →   ...
// → ]
```

<br>


## License

As of 18 April 2025, this project is licensed under AGPL-3.0. Previous versions remain under MIT.

<br>
<br>


[![](https://raw.githubusercontent.com/qb40/designs/gh-pages/0/image/11.png)](https://wolfram77.github.io)<br>
![](http://www.fao.org/typo3temp/pics/3e0b195db4.jpg)
![](http://www.fao.org/typo3temp/pics/c668f2d5f2.jpg)
![](http://www.fao.org/typo3temp/pics/57695feade.jpg)
![](http://www.fao.org/typo3temp/pics/e4052a2c33.jpg)<br>
[![ORG](https://img.shields.io/badge/org-nodef-green?logo=Org)](https://nodef.github.io)
![](https://ga-beacon.deno.dev/G-RC63DPBH3P:SH3Eq-NoQ9mwgYeHWxu7cw/github.com/nodef/infoods)


[INFOODS]: http://www.fao.org/infoods/infoods/en/
