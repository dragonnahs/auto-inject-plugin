/**
 * @license
 * Copyright 2019 Google Inc.
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

const assert = require('assert');

const extractChunks = require('./lib/extract-chunks');
const insertLinksIntoHtml = require('./lib/insert-links-into-html');

class AutoInjectPlugin {
  
  addLinks(compilation, htmlPluginData) {

    const extractedChunks = extractChunks({
      compilation,
      optionsInclude: Object.keys(htmlPluginData.assets.chunks),
    });

    // Flatten the list of files.
    const allFiles = extractedChunks.reduce((accumulated, chunk) => {
      return accumulated.concat(chunk.files);
    }, []);
    const uniqueFiles = new Set(allFiles);
    const filteredFiles = [...uniqueFiles]
    
    const sortedFilteredFiles = filteredFiles.sort();

    const links = [];
    const publicPath = compilation.outputOptions.publicPath || '';
    for (const file of sortedFilteredFiles) {
      const href = `${publicPath}${file}`;
      links.push(href);
    }
    htmlPluginData.html = insertLinksIntoHtml({
      links,
      html: htmlPluginData.html,
    });

    return htmlPluginData;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(
        this.constructor.name,
        compilation => {
          // This is set in html-webpack-plugin pre-v4.
          let hook = compilation.hooks.htmlWebpackPluginAfterHtmlProcessing;

          if (!hook) {
            const [HtmlWebpackPlugin] = compiler.options.plugins.filter(
                (plugin) => plugin.constructor.name === 'HtmlWebpackPlugin');
            assert(HtmlWebpackPlugin, 'Unable to find an instance of ' +
                'HtmlWebpackPlugin in the current compilation.');
            hook = HtmlWebpackPlugin.constructor.getHooks(compilation).beforeEmit;
          } 

          hook.tapAsync(
              this.constructor.name,
              (htmlPluginData, callback) => {
                try {
                  callback(null, this.addLinks(compilation, htmlPluginData));
                } catch (error) {
                  callback(error);
                }
              }
          );
        }
    );
  }
}

module.exports = AutoInjectPlugin;
