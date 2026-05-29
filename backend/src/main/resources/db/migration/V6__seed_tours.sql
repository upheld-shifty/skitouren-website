-- Seed: Beispieltouren
-- Regionen: 1=Berner Oberland, 2=Wallis, 3=Graubünden, 4=Uri, 5=Glarus,
--           6=Appenzell, 7=Zentralschweiz, 8=Tessin, 9=Waadt

INSERT INTO tours (
    slug, title, tour_type, difficulty, region_id,
    summary, description,
    elevation_up, elevation_down, distance_km, duration_min,
    start_location, end_location, best_season, tour_date, published
) VALUES

-- ── Skitouren ──────────────────────────────────────────────────────────────

('schilthorn-via-birg-2025',
 'Schilthorn via Birg',
 'SKITOUR', 'WT3', 1,
 'Klassische Skitour mit grandiosem Eiger-Mönch-Jungfrau-Panorama.',
 'Vom Mürren steigt man zunächst durch lichten Lärchenwald auf den Schilthornhang. Ab Birg (2677 m) wird das Gelände alpiner — der Gipfelhang verlangt Trittsicherheit und ist bei Vereisung heikel. Oben belohnt das 360°-Panorama mit Eiger, Mönch, Jungfrau und dem Berner Mittelland. Die Abfahrt über die Südwestflanke ist bei guten Verhältnissen ein Genuss; alternativ mit der Gondel zurück nach Mürren.',
 1200, 1200, 12.5, 240,
 'Mürren (1638 m)', 'Schilthorn (2970 m)',
 'Januar bis März', '2025-02-08', true),

('wildstrubel-lenk-2025',
 'Wildstrubel ab Lenk',
 'SKITOUR', 'WT4', 1,
 'Ausdauernde Hochtour auf einen der grossen Berner Voralpen-Gipfel.',
 'Von Lenk geht es über den Iffigsee-Hang und das Wildsee-Plateau auf den Hauptgipfel des Wildstrubels (3244 m). Die Tour ist lang und verlangt Kondition; das obere Gletschergelände erfordert Spaltenkenntnisse. Die Fernsicht bei Föhn reicht bis zum Mont Blanc. Rückfahrt mit der Gondel ab Crans-Montana möglich (Skipass nötig).',
 1650, 600, 18.0, 330,
 'Lenk (1068 m)', 'Wildstrubel (3244 m)',
 'Februar bis April', '2025-03-15', true),

('piz-beverin-2024',
 'Piz Beverin — Skiabfahrt ins Heinzenberg',
 'SKITOUR', 'WT3', 3,
 'Einsame Skitour mit traumhafter Abfahrt ins fast vergessene Heinzenberg-Tal.',
 'Aufstieg ab Glaspass durch weitläufige Wälder und offene Hänge auf den Piz Beverin (2998 m). Das Gipfelplateau ist weit und eben — ein herrlicher Rastplatz. Abstieg auf der Nordwestflanke ins Dorf Cazis: selten befahren, tiefer Pulverschnee wenn man früh dran ist. Öffentliche Rückfahrt mit Postauto möglich.',
 1450, 1900, 16.0, 300,
 'Glaspass (1846 m)', 'Cazis (618 m)',
 'Januar bis März', '2024-01-27', true),

('rigi-kulm-schneeschuh-2025',
 'Rigi Kulm — Schneeschuhwanderung',
 'SCHNEESCHUH', 'WT2', 7,
 'Gemütliche Schneeschuhwanderung auf die Königin der Berge mit Seeblick.',
 'Von Weggis mit der Gondel auf Rigi Kaltbad, dann auf breiten Schneeschuhspuren dem Rücken entlang auf den Kulm (1797 m). Familientauglich, kaum Lawinengefahr, unterwegs zwei bewirtschaftete Hütten. Das Panorama über Vierwaldstättersee, Zürichsee und die Voralpen entschädigt für jeden Regentag.',
 350, 350, 7.0, 150,
 'Rigi Kaltbad (1438 m)', 'Rigi Kulm (1797 m)',
 'Dezember bis März', '2025-01-18', true),

-- ── Wanderungen ────────────────────────────────────────────────────────────

('grosser-mythen-2024',
 'Grosser Mythen ab Brunni',
 'WANDERUNG', 'T3', 7,
 'Der markante Kegelberg über Schwyz — kurz, steil, lohnend.',
 'Vom Brunni (Rickenbach) folgt man dem gut markierten Steig direkt auf den Gipfel (1898 m). Der Weg ist kurz, aber auf den letzten 200 Höhenmetern ausgesetzt und felsig — festes Schuhwerk obligatorisch. Oben thront das Bergrestaurant, und die Aussicht auf Vierwaldstättersee und Glarner Alpen ist schlicht spektakulär. Abstieg über den Nordgrat zum Haggenegg möglich.',
 750, 750, 5.5, 160,
 'Brunni (1128 m)', 'Grosser Mythen (1898 m)',
 'Mai bis Oktober', '2024-07-14', true),

('fuorcla-surlej-2024',
 'Fuorcla Surlej — Corvatsch-Übergang',
 'WANDERUNG', 'T2', 3,
 'Aussichtsreicher Übergang mit direktem Blick auf den Morteratsch-Gletscher.',
 'Von Silvaplana geht es über den Lej da Champfèr und durch Arven-Wald auf die Fuorcla Surlej (2755 m). Der Pass bietet einen der besten Aussichtspunkte auf den Piz Bernina und das Morteratsch-Gletscherbecken. Abstieg nach Pontresina durch das Val Roseg — vorbei an Murmeltieren und gelegentlich Steinböcken.',
 1000, 900, 14.0, 270,
 'Silvaplana (1815 m)', 'Pontresina (1805 m)',
 'Juli bis Oktober', '2024-08-03', true),

('churfirsten-traversierung-2024',
 'Churfirsten-Grat: Selun bis Brisi',
 'WANDERUNG', 'T4', 3,
 'Anspruchsvolle Gratwanderung mit Tiefblick auf Walensee und Toggenburg.',
 'Die Traversierung des siebenzackigen Churfirsten-Grates zählt zu den eindrücklichsten Bergtouren der Ostschweiz. Ab Leist (Seilbahn Starkenbach) auf den Selun, dann dem ausgesetzten Grat entlang über Frumsel, Zuestoll, Brisi. Stellen im II. Grad, guter Felsgriff nötig. Abstieg über Schäfler nach Amden.',
 1400, 1600, 18.0, 480,
 'Leist (1800 m)', 'Amden (910 m)',
 'Juli bis September', '2024-09-07', true),

-- ── Klettersteige ──────────────────────────────────────────────────────────

('via-ferrata-murren-2024',
 'Klettersteig Mürren — Gimmelwald',
 'KLETTERSTEIG', 'K3', 1,
 'Luftiger Klettersteig hoch über dem Lauterbrunnental mit Blick auf die Eiger-Nordwand.',
 'Der Klettersteig startet direkt beim Bahnhof Mürren und führt über gesicherte Felspassagen, Leitern und eine Hängebrücke hinunter nach Gimmelwald. Technisch mittelschwer (C/D), aber die Ausgesetztheit über dem tiefen Tal ist beeindruckend. Klettersteigset und Helm sind Pflicht. Rückfahrt mit Seilbahn ins Tal.',
 150, 450, 3.5, 120,
 'Mürren (1638 m)', 'Gimmelwald (1363 m)',
 'Juni bis Oktober', '2024-06-22', true),

('via-ferrata-braunwald-2024',
 'Klettersteig Braunwald — Eggstock',
 'KLETTERSTEIG', 'K4', 5,
 'Einer der längsten und abwechslungsreichsten Klettersteige der Zentralschweiz.',
 'Vom autofreien Braunwald steigt man über den Ortstock-Normalweg auf, bevor es in den Klettersteig (Schwierigkeit D) geht. Mehrere Schlüsselstellen im senkrechten Gneis, zwei exponierte Querungen und eine lange Seilbrücke. Nur für geübte Klettersteiggeher. Abstieg ins Linthtal bietet ein nochmals anderes Landschaftsbild.',
 900, 1100, 10.0, 300,
 'Braunwald (1256 m)', 'Linthal (650 m)',
 'Juli bis September', '2024-07-30', true),

-- ── Hochtouren ─────────────────────────────────────────────────────────────

('dom-mit-fuehrerbegleitung-2024',
 'Dom (4545 m) — Höchster rein-schweizerischer Gipfel',
 'HOCHTOUR', 'ZS', 2,
 'Dreitägige Hochtour auf den höchsten Gipfel, der vollständig in der Schweiz liegt.',
 'Tag 1: Aufstieg zur Domhütte SAC (2940 m) über das Festi-Gletscher-Moränengebiet. Tag 2: Frühaufbruch um 03:00 Uhr. Über den Festigletscher auf den Festigrat, dann dem langen Nordwestgrat entlang auf den Gipfel (4545 m). Stellenweise Blankeis, Steigeisen und Pickel zwingend. Die letzten 200 Hm am Grat sind ausgesetzt (II-). Tag 3: Abstieg zur Domhütte und zurück ins Tal. Bergführer empfohlen.',
 2200, 2200, 22.0, 600,
 'Randa (1408 m)', 'Dom (4545 m)',
 'Juli bis August', '2024-08-10', true),

('sustenhorn-2024',
 'Sustenhorn — Einstieg Hochtourismus',
 'HOCHTOUR', 'WS', 4,
 'Ideale Einsteiger-Hochtour: mässige Länge, unkomplizierter Gletscher, grossartiges Gipfelpanorama.',
 'Von Gadmen Aufstieg zur Voralphütte (2072 m), Übernachtung. Am nächsten Morgen über den Steinlimmigletscher auf das Sustenhorn (3503 m). Das Gletschergelände ist flach bis moderat geneigt, Spalten gut erkennbar. Der Gipfelhang ist 35°-steil; Steigeisen und Pickel werden benötigt. Vom Gipfel Blick auf Dammagletscher, Reuss-Ursprung und an klaren Tagen bis zum Oberland.',
 1800, 1800, 18.0, 480,
 'Gadmen (1205 m)', 'Sustenhorn (3503 m)',
 'Juni bis September', '2024-06-29', true);
