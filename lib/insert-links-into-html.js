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

 var HTML = require('html-parse-stringify2')


 function judgeIsLoadedCss(ast, astLinksTemp, astScriptsTemp) {
   ast.map(item => {
     if (item.name === 'link' && item.type === 'tag' && item.attrs.rel === 'stylesheet') {
       astLinksTemp.push(item)
     }
     if (item.name === 'script' && item.type === 'tag') {
       astScriptsTemp.push(item)
     }
     if (item.children && item.children.length > 0) {
       judgeIsLoadedCss(item.children, astLinksTemp, astScriptsTemp)
     }
   })
   return { astLinks: astLinksTemp, astScripts: astScriptsTemp }
 }
 
 function insertLinksIntoHtml({ html, links = [] }) {
   if (links.length === 0) {
     return html;
   }
   let ast = HTML.parse(html)
   let { astLinks, astScripts } = judgeIsLoadedCss(ast, [], [])
   links.map(link => {
     let lastUnit = link.split('/')[link.split('/').length - 1]
     let linkExt = lastUnit.substring(lastUnit.lastIndexOf('.') + 1)
     if (!astLinks.some(item => item.attrs.href === link) && linkExt === 'css') {
       html = html.replace('</head>', '<link href="' + link + '" rel=stylesheet>' + '</head>')
     }
     if (!astScripts.some(item => item.attrs.src === link) && linkExt === 'js') {
       html = html.replace('</body>', '<script src=' + link + '></script>' + '</body>')
     }
   })
 
   return html
 }
 
 module.exports = insertLinksIntoHtml;
 