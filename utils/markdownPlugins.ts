
import { visit } from 'unist-util-visit';

/**
 * Remark Plugin: Ruby Annotation
 * Detects syntax: [Base]{Reading} or [Base]^(Reading)
 * 
 * Strategy:
 * Since we want to use a custom React component to render the complex separator logic (dots, etc.),
 * we transform the detected syntax into a standard Markdown "Link" node with a specific protocol.
 * 
 * Transformation:
 * [你好]{nihao}  ->  [你好](ruby:nihao)
 * 
 * The React component will then intercept 'a' tags, check for 'ruby:' protocol, 
 * and render the <ruby> tag instead of an anchor.
 */
export function remarkRuby() {
  return (tree: any) => {
    visit(tree, 'text', (node, index, parent) => {
      // Regex explanation:
      // \[          Match opening bracket
      // (.*?)       Capture Group 1: The Base text (non-greedy)
      // \]          Match closing bracket
      // (?:         Non-capturing group for the reading part options
      //   \{        Option A: {Reading}
      //     (.*?)   Capture Group 2: Reading inside {}
      //   \}
      //   |         OR
      //   \^\(      Option B: ^(Reading)
      //     (.*?)   Capture Group 3: Reading inside ^()
      //   \)
      // )
      const rubyRegex = /\[(.*?)\](?:\{(.*?)\}|\^\((.*?)\))/g;
      
      const value = node.value;
      const matches = [...value.matchAll(rubyRegex)];

      if (!matches.length) return;

      const children = [];
      let lastIndex = 0;

      for (const match of matches) {
        const fullMatch = match[0];
        const baseText = match[1];
        // Reading is either in group 2 ({}) or group 3 ( ^() )
        const reading = match[2] || match[3];
        const matchIndex = match.index!;

        // 1. Push text before the match
        if (matchIndex > lastIndex) {
          children.push({
            type: 'text',
            value: value.slice(lastIndex, matchIndex)
          });
        }

        // 2. Push the transformed Ruby node (as a Link)
        // We use a link node so we don't have to enable 'rehype-raw' (dangerous/heavy)
        // or write custom complex AST handlers. Standard markdown parsers understand links.
        children.push({
          type: 'link',
          title: null,
          url: `ruby:${reading}`, // Store reading in URL
          children: [
            { type: 'text', value: baseText } // Store base text as link text
          ]
        });

        lastIndex = matchIndex + fullMatch.length;
      }

      // 3. Push remaining text
      if (lastIndex < value.length) {
        children.push({
          type: 'text',
          value: value.slice(lastIndex)
        });
      }

      // Replace the current text node with our new array of nodes
      parent.children.splice(index, 1, ...children);
      
      // Return new index to skip over the nodes we just inserted 
      // (prevents infinite loops if visit traverses new nodes immediately)
      return index + children.length;
    });
  };
}

/**
 * Remark Plugin: Center Directive
 * Support for :::center ... ::: syntax
 */
export function remarkCenter() {
  return (tree: any) => {
    visit(tree, (node) => {
      if (
        node.type === 'containerDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'textDirective'
      ) {
        if (node.name !== 'center') return;

        const data = node.data || (node.data = {});
        const tagName = node.type === 'textDirective' ? 'span' : 'div';

        data.hName = tagName;
        data.hProperties = {
            style: { 
                textAlign: 'center', 
                display: node.type === 'textDirective' ? 'inline-block' : 'block',
                width: '100%' // Ensure div takes full width to center content effectively
            },
            className: 'center-aligned-block'
        };

        // For container directives, we need to enforce centering on child paragraphs
        // This is crucial because WeChatPreview applies standard styles (like justify/left)
        // to paragraphs which can override the inherited center alignment from the wrapper div.
        if (node.type === 'containerDirective' && node.children) {
            node.children.forEach((child: any) => {
                if (child.type === 'paragraph') {
                    const childData = child.data || (child.data = {});
                    const childProps = childData.hProperties || (childData.hProperties = {});
                    
                    // Merge style
                    childProps.style = {
                        ...(childProps.style || {}),
                        textAlign: 'center'
                    };
                }
            });
        }
      }
    });
  };
}