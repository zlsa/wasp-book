#!/bin/sh

pandoc -s -S book.md --normalize -o book.epub
pandoc -s -S -t html5 book.md -c static/style.css --normalize -o index.html

cp static/* output/
