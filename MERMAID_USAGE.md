# Mermaid Diagrams in Your Blog

This guide explains how to use Mermaid diagrams in your blog posts.

## Quick Start

1. **In MDX files (.mdx)**: Import and use the Mermaid component

```mdx
---
title: "My Post with Diagrams"
# ... other frontmatter
---
import Mermaid from "../../components/Mermaid.tsx"

# My Blog Post

Here's a flowchart:

<Mermaid chart={`
graph TD
    A[Start] --> B[Process]
    B --> C[End]
`} />
```

## Component Props

The `Mermaid` component accepts these props:

- **`chart`** (required): The Mermaid diagram definition as a string
- **`id`** (optional): Unique identifier for the diagram
- **`className`** (optional): Additional CSS classes

## Example Usage

### Basic Flowchart
```jsx
<Mermaid chart={`
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[Alternative]
`} />
```

### Sequence Diagram
```jsx
<Mermaid chart={`
sequenceDiagram
    Alice->>Bob: Hello Bob!
    Bob-->>Alice: Hello Alice!
`} />
```

### Class Diagram
```jsx
<Mermaid chart={`
classDiagram
    class Animal {
        +String name
        +move()
    }
    class Dog {
        +bark()
    }
    Animal <|-- Dog
`} />
```

## Supported Diagram Types

- **Flowcharts** (`graph` or `flowchart`)
- **Sequence Diagrams** (`sequenceDiagram`)
- **Class Diagrams** (`classDiagram`)
- **State Diagrams** (`stateDiagram-v2`)
- **Entity Relationship Diagrams** (`erDiagram`)
- **User Journey** (`journey`)
- **Gantt Charts** (`gantt`)
- **Pie Charts** (`pie`)
- **Git Graphs** (`gitgraph`)
- **C4 Context Diagrams** (`C4Context`)
- **Mindmaps** (`mindmap`)
- **Timelines** (`timeline`)

## Theming

The diagrams automatically adapt to your blog's light/dark theme:

- **Light theme**: Uses clean, professional colors
- **Dark theme**: Automatically switches to dark-friendly colors
- **Font**: Inherits your blog's font family

## Tips & Best Practices

### 1. Use Template Literals
Always use template literals (backticks) for multi-line diagrams:

```jsx
<Mermaid chart={`
graph TD
    A --> B
    B --> C
`} />
```

### 2. Escape Special Characters
If your diagram includes backticks, escape them:

```jsx
<Mermaid chart={`
graph TD
    A["Code: \`const x = 1\`"] --> B
`} />
```

### 3. Add IDs for Complex Diagrams
For complex diagrams, provide an ID to avoid conflicts:

```jsx
<Mermaid 
  id="user-workflow"
  chart={`
    graph TD
        A[User Login] --> B[Dashboard]
  `} 
/>
```

### 4. Custom Styling
Add custom classes for specific styling:

```jsx
<Mermaid 
  className="my-special-diagram"
  chart={`graph TD; A --> B`} 
/>
```

## Error Handling

The component includes built-in error handling:

- **Loading state**: Shows "Loading diagram..." while rendering
- **Error display**: Shows error messages if diagram fails to render
- **Debug info**: Click error details to see the chart source

## Performance Notes

- Diagrams are rendered client-side for optimal flexibility
- The Mermaid library is loaded dynamically to reduce initial bundle size
- Each diagram is rendered independently for better error isolation

## Troubleshooting

### Diagram Not Rendering
1. Check the Mermaid syntax is valid
2. Ensure you're using template literals (backticks)
3. Check browser console for errors

### Theme Issues
The component automatically detects your blog's theme. If colors look wrong:
1. Clear browser cache
2. Check if custom CSS is overriding diagram styles

### Performance Issues
For pages with many diagrams:
1. Consider using simpler diagram types
2. Split complex diagrams into multiple smaller ones

## Advanced Examples

### Complex Flowchart
```jsx
<Mermaid chart={`
graph TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]
    D --> G[fa:fa-ban Banned]
    E --> H[fa:fa-heart Love]
    F --> I[fa:fa-money Money]
`} />
```

### Detailed Sequence Diagram
```jsx
<Mermaid chart={`
sequenceDiagram
    participant U as User
    participant A as App
    participant DB as Database
    
    U->>A: Login Request
    activate A
    A->>DB: Validate Credentials
    activate DB
    DB-->>A: User Data
    deactivate DB
    A-->>U: Login Success
    deactivate A
    
    Note over U,DB: User is now authenticated
`} />
```

## References

- [Mermaid Documentation](https://mermaid.js.org/)
- [Mermaid Live Editor](https://mermaid.live/) - Test your diagrams
- [Mermaid Syntax Guide](https://mermaid.js.org/intro/syntax-reference.html) 