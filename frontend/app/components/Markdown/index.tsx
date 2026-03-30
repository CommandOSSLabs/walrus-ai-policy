import Markdown from "react-markdown";

interface MarkdownProps {
  content: string;
}

export default ({ content }: MarkdownProps) => {
  return (
    <Markdown
      components={{
        code: ({ children, className, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");

          // when array?, possible <li> inside <list>
          const content = Array.isArray(children)
            ? children.join("")
            : String(children);

          const isSpecialBlock = /[┌┐└┘│─]/.test(content);

          if (match || isSpecialBlock) {
            return (
              <div className="p-4 bg-[#191F2D] border border-white/12 rounded-sm">
                <code {...props}>{children}</code>
              </div>
            );
          }

          return (
            <code className="bg-white/10" {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </Markdown>
  );
};
