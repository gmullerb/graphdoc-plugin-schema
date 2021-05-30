//  Copyright (c) 2021 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const SchemaPlugin = require('@2fd/graphdoc/plugins/document.schema').default
const graphdocUtils = require('@2fd/graphdoc/lib/utility')

const SUPPORTED_KINDS_REGEX = /^(?:SCALAR|OBJECT|INTERFACE|UNION|ENUM|INPUT_OBJECT)$/

function activeOption(option) {
  return option === true || option === undefined
}

class GraphdocPluginSchema {
  constructor(schema, projectPackage, graphdocPackage) {
    const config = projectPackage['graphdoc-plugin-schema'] || {}
    this.documentTitle = config.documentTitle || 'Definition'
    this.types = new Map()
    schema.types && schema.types.forEach(type => SUPPORTED_KINDS_REGEX.test(type.kind) && this.types.set(type.name, type))
    this.directives = new Map()
    schema.directives && schema.directives.forEach(directive => this.directives.set(directive.name, directive))
    this.builder = new SchemaPlugin(schema, {
      ...projectPackage,
      graphdoc: {
        ...projectPackage.graphdoc,
        baseUrl: projectPackage.graphdoc && projectPackage.graphdoc.baseUrl ? projectPackage.graphdoc.baseUrl : ''
      }
    }, graphdocPackage)
    if (activeOption(config.enableAssets)) {
      this.getHeaders = this.builder.getHeaders
      this.getAssets = this.builder.getAssets
    }
  }

  getDocument(description) {
    return [ new graphdocUtils.DocumentSection(this.documentTitle, graphdocUtils.html.code(description)) ]
  }

  getDocuments(buildForType) {
    const type = this.types.get(buildForType)
    if (type) {
      switch (type.kind) {
        case 'SCALAR':
          return this.getDocument(this.builder.scalar(type))
        case 'OBJECT':
          return this.getDocument(this.builder.object(type))
        case 'INTERFACE':
          return this.getDocument(this.builder.interfaces(type))
        case 'UNION':
          return this.getDocument(this.builder.union(type))
        case 'ENUM':
          return this.getDocument(this.builder.enum(type))
        case 'INPUT_OBJECT':
          return this.getDocument(this.builder.inputObject(type))
      }
    }
    else {
      const directive = this.directives.get(buildForType)
      if (directive) {
        return this.getDocument(this.builder.directive(directive))
      }
    }
    return []
  }
}

module.exports.default = GraphdocPluginSchema
