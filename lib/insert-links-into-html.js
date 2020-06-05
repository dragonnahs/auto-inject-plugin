/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function insertLinksIntoHtml({html, links=[]}) {
  if (links.length === 0) {
    return html;
  }

  links.map(link => {
    // css inject
    if(/\.css$/.test(link) && !html.includes('href='+link+' rel=stylesheet')){
      html = html.replace('</head>', '<link href="'+link+'" rel=stylesheet>' + '</head>')
    }
    if(/\.js$/.test(link) && !html.includes('src='+link)){
      html = html.replace('</body>', '<script src='+link+'></script>' + '</body>')
    }
  })


  return html

  throw new Error(`The HTML provided did not contain a </head> or a <body>:\n\n${html}`);
}

module.exports = insertLinksIntoHtml;
