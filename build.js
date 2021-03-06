
var fs = require('fs');
var marked = require('marked');
var hogan = require('hogan.js');
var stylus = require('stylus');

marked.setOptions({
  smartypants: true
});

var templates = {
  'section': 'template/section.html',
  'page': 'template/page.html'
};

for(var i in templates) {
  templates[i] = hogan.compile(fs.readFileSync(templates[i], 'utf8'));
}

var sections = [];

function read_section(filename, metadata) {
  var s = {
    filename: filename,
    name: metadata.name,
    number: sections.length,
    name_clean: metadata.name.replace(/[\'\"]/, '').replace(/[^\sa-zA-Z0-9]+/, '-').replace(/\s+/, '-').toLowerCase()
  };

  s.text = fs.readFileSync(filename, 'utf8');

  sections.push(s);

  return s.text.split(' ').length;
}

function md_to_html(sections) {
  var s = [];
  
  for(var i=0; i<sections.length; i++) {
    sections[i].markdown = marked(sections[i].text);
    
    s.push(sections[i]);
  }

  return s;
}

function html_to_string(sections) {
  var s = [];
  
  for(var i=0; i<sections.length; i++) {
    s.push(templates.section.render(sections[i]));
  }

  return s;
}

function read() {

  let sections = [
    ['src/prologue.md', "Prologue"],
    ['src/atmospheric-entry.md', "Atmospheric Entry"],
    ['src/repairs-underway.md', "Repairs Underway"],
  ];

  let words = 0;

  for(let i=0; i<sections.length; i++) {
    let section = sections[i];
    
    words += read_section(section[0], {
      name: section[1]
    });
    
  }

  console.log(words + ' words');
  
}

function generate() {
  var html_sections = html_to_string(md_to_html(sections)).join('\n');

  fs.writeFileSync('index.html', templates.page.render({
    title: 'Wasp',
    author: 'Jon Ross',
    sections: html_sections,
    blurb: [
      'In progress. Last updated December 12.'
    ].join('\n')
  }));
  
}

stylus.render(fs.readFileSync('static/main.styl', 'utf8'), {
  filename: 'static/main.styl'
}, function(err, css) {
  fs.writeFileSync('style.css', css);

  read();
  generate();
});
