#!/usr/bin/env python3
"""Import a small, attributed candidate lexicon for editorial review.

Do not map vocabulary to an *official* N5 list: none exists.
No network calls. Source XML downloaded independently from EDRDG.
The output is a CANDIDATE lexicon, NOT assessment questions or certified translations.
"""
import argparse
import json
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

LICENSE = "CC BY-SA 4.0"
ATTRIBUTION = "JMdict / Electronic Dictionary Research and Development Group (EDRDG)"


def seeds(path):
    words = set()
    for line in Path(path).read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#"):
            words.add(line)
    return words


def parse_jmdict(source, candidates):
    found = {}
    try:
        iterator = ET.iterparse(source, events=("end",))
        for _, element in iterator:
            if element.tag != "entry":
                continue
            kanji = [x.text for x in element.findall("./k_ele/keb") if x.text]
            readings = [x.text for x in element.findall("./r_ele/reb") if x.text]
            lemmas = [x for x in [*kanji, *readings] if x in candidates]
            if lemmas:
                # Keep source-language glosses as editorial leads; NEVER auto-label them PT-BR.
                glosses = []
                for sense in element.findall("sense"):
                    for gloss in sense.findall("gloss"):
                        language = gloss.get("{http://www.w3.org/XML/1998/namespace}lang", "eng")
                        if language == "eng" and gloss.text:
                            glosses.append(gloss.text)
                entry = {
                    "id": "jmdict:" + (element.findtext("ent_seq") or "unknown"),
                    "kanji": kanji[:15],
                    "readings": readings[:15],
                    "sourceGlossEnglish": list(dict.fromkeys(glosses))[:20],
                    "translationPtBr": None,
                    "candidateN5": True,
                    "editorialStatus": "draft",
                    "source": "JMdict",
                    "attribution": ATTRIBUTION,
                    "license": LICENSE,
                }
                for lemma in lemmas:
                    found[lemma] = entry
            element.clear()
    except ET.ParseError as exc:
        raise SystemExit(f"Unable to parse JMdict XML ({exc}). Use a full JMdict export with compatible DTD/entity declarations.")
    # Stable order and unique JMDict entries even for alternate spellings.
    result = {}
    for lemma in sorted(found):
        entry = found[lemma]
        result[entry["id"]] = entry
    return [result[key] for key in sorted(result)]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", required=True, help="Path to locally downloaded JMdict XML")
    parser.add_argument("--seeds", default="data/lexicon/n5-seed-lemmas.txt")
    parser.add_argument("--output", default="data/lexicon/jmdict-n5-candidates.json")
    args = parser.parse_args()
    catalog = seeds(args.seeds)
    rows = parse_jmdict(args.source, catalog)
    out = Path(args.output)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps({
        "schemaVersion": 1,
        "source": "JMdict / EDRDG",
        "license": LICENSE,
        "attribution": ATTRIBUTION,
        "note": "Candidate lexicon only. No official JLPT-level certification, no reviewed PT-BR translations.",
        "entries": rows,
        "seedCount": len(catalog),
        "matchedEntries": len(rows),
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Imported {len(rows)} candidate records from {len(catalog)} unique seeds into {out}")
    if not rows:
        print("WARNING: no matches; verify XML, seeds and encoding", file=sys.stderr)


if __name__ == "__main__":
    main()
