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

function getChunkEntryNames (chunk) {
  if ('groupsIterable' in chunk) {
    return Array.from(new Set(getNames(chunk.groupsIterable)))
  } else {
    return chunk.entrypoints.map(e => e.options.name)
  }
}

function getNames (groups, processed = new Set()) {
  const Entrypoint = require('webpack/lib/Entrypoint')
  const names = []
  for (const group of groups) {
    if (group instanceof Entrypoint) {
      // entrypoint
      if (group.options.name) {
        names.push(group.options.name)
      }
    } else if (!processed.has(group)) {
      processed.add(group)
      names.push(...getNames(group.parentsIterable, processed))
    }
  }
  return names
}

function extractChunks({compilation, optionsInclude}) {
  let chunks = compilation.chunks
  
  if (optionsInclude && Array.isArray(optionsInclude)) {
    chunks = chunks.filter(chunk => {
      const names = getChunkEntryNames(chunk)
      return names.some(name => optionsInclude.includes(name))
    })
  }
  return chunks
}

module.exports = extractChunks;
