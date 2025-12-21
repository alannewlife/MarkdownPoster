
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
