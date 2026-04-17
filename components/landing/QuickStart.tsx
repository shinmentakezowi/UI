import { Code2 } from "lucide-react";
import { FadeIn } from "@/components/FadeIn";
import { getTranslations } from "next-intl/server";

function CodeBlock({ title, children }: { title: string; children: string }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#0e0e0e] overflow-hidden flex flex-col min-w-0">
      <div className="px-4 py-3 border-b border-white/[0.05] flex items-center gap-2 shrink-0">
        <div className="flex gap-1.5">
          {["bg-red-500/40","bg-yellow-500/40","bg-green-500/40"].map(c=>(
            <div key={c} className={`w-3 h-3 rounded-full ${c}`} />
          ))}
        </div>
        <span className="text-xs text-zinc-500 font-mono ml-1">{title}</span>
      </div>
      <pre className="px-5 pt-5 pb-0 text-xs sm:text-sm font-mono leading-7 overflow-x-auto min-w-0 flex-1">
        <code className="text-zinc-300">{children}</code>
      </pre>
      <div className="h-5 shrink-0" />
    </div>
  );
}

export async function QuickStart() {
  const t = await getTranslations("quickStart");

  return (
    <section id="quickstart" className="py-20 sm:py-28 px-4 border-t border-white/[0.04] scroll-mt-20 overflow-x-hidden">
      <FadeIn>
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs text-zinc-400">
            <Code2 className="w-3 h-3 text-violet-400" />
            {t("badge")}
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
          {t("titleStart")}<span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">{t("titleHighlight")}</span>
        </h2>
        <p className="text-sm text-zinc-500 text-center mb-10">
          {t.rich("subtitle", {
            code: (chunks) => <code className="text-zinc-300 bg-white/[0.06] px-1.5 py-0.5 rounded text-xs">{chunks}</code>,
          })}
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <CodeBlock title="Claude Code / Shell">
{`export ANTHROPIC_BASE_URL=\\
  https://api.hapuppy.com
export ANTHROPIC_AUTH_TOKEN=sk-hapuppy-your-key

claude`}
          </CodeBlock>
          <CodeBlock title="OpenAI SDK (Python)">
{`from openai import OpenAI

client = OpenAI(
  api_key="sk-hapuppy-your-key",
  base_url="https://api.hapuppy.com/v1",
)

resp = client.chat.completions.create(
  model="gpt-4o",
  messages=[{
    "role": "user",
    "content": "Hello!"
  }]
)`}
          </CodeBlock>
        </div>
      </div>
      </FadeIn>
    </section>
  );
}
