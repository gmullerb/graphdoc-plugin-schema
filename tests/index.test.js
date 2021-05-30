//  Copyright (c) 2021 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const GraphdocPluginSchema = require('../lib/index')

class MockSchemaPlugin {
  constructor(...args) {
    this.args = args
    this.scalar = jest.fn(() => 'scalar')
    this.object = jest.fn(() => 'object')
    this.interfaces = jest.fn(() => 'interface')
    this.union = jest.fn(() => 'union')
    this.enum = jest.fn(() => 'enum')
    this.inputObject = jest.fn(() => 'input')
    this.directive = jest.fn(() => 'directive')
    this.getHeaders = jest.fn()
    this.getAssets = jest.fn()
  }
}

jest.mock('@2fd/graphdoc/plugins/document.schema', () => ({
  __esModule: true,
  default:  jest.fn().mockImplementation(() => new MockSchemaPlugin())
}))

it('should use default options', function() {
  const plugin = new GraphdocPluginSchema.default({}, {}, {})

  expect(plugin.types.size).toBe(0)
  expect(plugin.directives.size).toBe(0)
  expect(plugin.documentTitle).toEqual('Definition')
  expect(plugin.getHeaders).not.toEqual(undefined)
  expect(plugin.getAssets).not.toEqual(undefined)
})

it('should use new options', function() {
  const plugin = new GraphdocPluginSchema.default({}, {
    graphdoc: { baseUrl: 'some' },
    'graphdoc-plugin-schema': {
      documentTitle: 'Description2',
      enableAssets: false
    }
  }, {})

  expect(plugin.types.size).toBe(0)
  expect(plugin.directives.size).toBe(0)
  expect(plugin.documentTitle).toEqual('Description2')
  expect(plugin.getHeaders).toEqual(undefined)
  expect(plugin.getAssets).toEqual(undefined)
})

const schema = {
  types: [
    { name: 'some1', kind: 'SCALAR', description: 'someDesc1' },
    { name: 'some2', kind: 'OBJECT', description: 'someDesc2' },
    { name: 'some3', kind: 'INTERFACE', description: 'someDesc3' },
    { name: 'some4', kind: 'UNION', description: 'someDesc4' },
    { name: 'some5', kind: 'ENUM', description: 'someDesc5' },
    { name: 'some6', kind: 'INPUT_OBJECT', description: 'someDesc6' },
    { name: 'some8', kind: 'OPERATION', description: 'someDesc7' }
  ],
  directives: [{ name: 'some7' }]
}

it('should create SCALAR document', function() {
  const plugin = new GraphdocPluginSchema.default(schema, {}, {})
  expect(plugin.types.size).toBe(6)
  expect(plugin.directives.size).toBe(1)

  const document = plugin.getDocuments('some1')

  expect(document).toEqual([{ title: 'Definition', description: '<code class="highlight"><ul class="code" style="padding-left:28px">scalar</ul></code>'}])
  expect(plugin.builder.scalar).toHaveBeenCalledTimes(1)
  expect(plugin.builder.object).toHaveBeenCalledTimes(0)
  expect(plugin.builder.interfaces).toHaveBeenCalledTimes(0)
  expect(plugin.builder.union).toHaveBeenCalledTimes(0)
  expect(plugin.builder.enum).toHaveBeenCalledTimes(0)
  expect(plugin.builder.inputObject).toHaveBeenCalledTimes(0)
  expect(plugin.builder.directive).toHaveBeenCalledTimes(0)
})

it('should create OBJECT document', function() {
  const plugin = new GraphdocPluginSchema.default(schema, {}, {})
  expect(plugin.types.size).toBe(6)
  expect(plugin.directives.size).toBe(1)

  const document = plugin.getDocuments('some2')

  expect(document).toEqual([{ title: 'Definition', description: '<code class="highlight"><ul class="code" style="padding-left:28px">object</ul></code>'}])
  expect(plugin.builder.scalar).toHaveBeenCalledTimes(0)
  expect(plugin.builder.object).toHaveBeenCalledTimes(1)
  expect(plugin.builder.interfaces).toHaveBeenCalledTimes(0)
  expect(plugin.builder.union).toHaveBeenCalledTimes(0)
  expect(plugin.builder.enum).toHaveBeenCalledTimes(0)
  expect(plugin.builder.inputObject).toHaveBeenCalledTimes(0)
  expect(plugin.builder.directive).toHaveBeenCalledTimes(0)
})

it('should create INTERFACE document', function() {
  const plugin = new GraphdocPluginSchema.default(schema, {}, {})
  expect(plugin.types.size).toBe(6)
  expect(plugin.directives.size).toBe(1)

  const document = plugin.getDocuments('some3')

  expect(document).toEqual([{ title: 'Definition', description: '<code class="highlight"><ul class="code" style="padding-left:28px">interface</ul></code>'}])
  expect(plugin.builder.scalar).toHaveBeenCalledTimes(0)
  expect(plugin.builder.object).toHaveBeenCalledTimes(0)
  expect(plugin.builder.interfaces).toHaveBeenCalledTimes(1)
  expect(plugin.builder.union).toHaveBeenCalledTimes(0)
  expect(plugin.builder.enum).toHaveBeenCalledTimes(0)
  expect(plugin.builder.inputObject).toHaveBeenCalledTimes(0)
  expect(plugin.builder.directive).toHaveBeenCalledTimes(0)
})

it('should create UNION document', function() {
  const plugin = new GraphdocPluginSchema.default(schema, {}, {})
  expect(plugin.types.size).toBe(6)
  expect(plugin.directives.size).toBe(1)

  const document = plugin.getDocuments('some4')

  expect(document).toEqual([{ title: 'Definition', description: '<code class="highlight"><ul class="code" style="padding-left:28px">union</ul></code>'}])
  expect(plugin.builder.scalar).toHaveBeenCalledTimes(0)
  expect(plugin.builder.object).toHaveBeenCalledTimes(0)
  expect(plugin.builder.interfaces).toHaveBeenCalledTimes(0)
  expect(plugin.builder.union).toHaveBeenCalledTimes(1)
  expect(plugin.builder.enum).toHaveBeenCalledTimes(0)
  expect(plugin.builder.inputObject).toHaveBeenCalledTimes(0)
  expect(plugin.builder.directive).toHaveBeenCalledTimes(0)
})

it('should create ENUM document', function() {
  const plugin = new GraphdocPluginSchema.default(schema, {}, {})
  expect(plugin.types.size).toBe(6)
  expect(plugin.directives.size).toBe(1)

  const document = plugin.getDocuments('some5')

  expect(document).toEqual([{ title: 'Definition', description: '<code class="highlight"><ul class="code" style="padding-left:28px">enum</ul></code>'}])
  expect(plugin.builder.scalar).toHaveBeenCalledTimes(0)
  expect(plugin.builder.object).toHaveBeenCalledTimes(0)
  expect(plugin.builder.interfaces).toHaveBeenCalledTimes(0)
  expect(plugin.builder.union).toHaveBeenCalledTimes(0)
  expect(plugin.builder.enum).toHaveBeenCalledTimes(1)
  expect(plugin.builder.inputObject).toHaveBeenCalledTimes(0)
  expect(plugin.builder.directive).toHaveBeenCalledTimes(0)
})

it('should create INPUT_OBJECT document', function() {
  const plugin = new GraphdocPluginSchema.default(schema, {}, {})
  expect(plugin.types.size).toBe(6)
  expect(plugin.directives.size).toBe(1)

  const document = plugin.getDocuments('some6')

  expect(document).toEqual([{ title: 'Definition', description: '<code class="highlight"><ul class="code" style="padding-left:28px">input</ul></code>'}])
  expect(plugin.builder.scalar).toHaveBeenCalledTimes(0)
  expect(plugin.builder.object).toHaveBeenCalledTimes(0)
  expect(plugin.builder.interfaces).toHaveBeenCalledTimes(0)
  expect(plugin.builder.union).toHaveBeenCalledTimes(0)
  expect(plugin.builder.enum).toHaveBeenCalledTimes(0)
  expect(plugin.builder.inputObject).toHaveBeenCalledTimes(1)
  expect(plugin.builder.directive).toHaveBeenCalledTimes(0)
})

it('should create directive document', function() {
  const plugin = new GraphdocPluginSchema.default(schema, {}, {})
  expect(plugin.types.size).toBe(6)
  expect(plugin.directives.size).toBe(1)

  const document = plugin.getDocuments('some7')

  expect(document).toEqual([{ title: 'Definition', description: '<code class="highlight"><ul class="code" style="padding-left:28px">directive</ul></code>'}])
  expect(plugin.builder.scalar).toHaveBeenCalledTimes(0)
  expect(plugin.builder.object).toHaveBeenCalledTimes(0)
  expect(plugin.builder.interfaces).toHaveBeenCalledTimes(0)
  expect(plugin.builder.union).toHaveBeenCalledTimes(0)
  expect(plugin.builder.enum).toHaveBeenCalledTimes(0)
  expect(plugin.builder.inputObject).toHaveBeenCalledTimes(0)
  expect(plugin.builder.directive).toHaveBeenCalledTimes(1)
})

it('should not create document and not failed', function() {
  const plugin = new GraphdocPluginSchema.default(schema, {}, {})
  expect(plugin.types.size).toBe(6)
  expect(plugin.directives.size).toBe(1)

  const document = plugin.getDocuments('some8')

  expect(document).toEqual([])
  expect(plugin.builder.scalar).toHaveBeenCalledTimes(0)
  expect(plugin.builder.object).toHaveBeenCalledTimes(0)
  expect(plugin.builder.interfaces).toHaveBeenCalledTimes(0)
  expect(plugin.builder.union).toHaveBeenCalledTimes(0)
  expect(plugin.builder.enum).toHaveBeenCalledTimes(0)
  expect(plugin.builder.inputObject).toHaveBeenCalledTimes(0)
  expect(plugin.builder.directive).toHaveBeenCalledTimes(0)
})
