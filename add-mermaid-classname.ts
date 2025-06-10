import { visit, CONTINUE } from "unist-util-visit"
import type { Plugin } from 'unified';
import type { Root, Element, Node } from 'hast';

const visitor = (node: Node) => {
  const dataLanguageMermaid = "mermaid"
  const typeElement = "element"
  const tagNamePre = "pre"
  const classMermaid = dataLanguageMermaid

  const isPreElement = (node: Node): node is Element => {
    if (node.type !== typeElement) return false
    
    const element = node as Element
    if (!element.tagName || element.tagName !== tagNamePre) return false
    if (!element.properties) return false
    
    return element.properties.dataLanguage === dataLanguageMermaid
  }

  if(!isPreElement(node)) {
    return CONTINUE
  }

  const element = node as Element
  const properties = element.properties
  const className = properties.className as Array<string>
  properties.className = [...className, classMermaid]

  return CONTINUE
}

const addMermaidClass: Plugin<void[], Root> = () =>
  (ast: Root) => visit(ast, visitor)

export default addMermaidClass 