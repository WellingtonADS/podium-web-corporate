#!/usr/bin/env python3
"""Automated Markdown fixes for podium-docs-assets.
Fixes implemented:
- Convert emphasized 'Última atualização' lines to a h4 heading
- Add language to fenced code blocks where missing (heuristic)
- Normalize ordered list numbers to '1.' style
- Remove trailing spaces and collapse multiple blank lines
- Wrap long lines at 120 chars preserving list indentation
- Replace bare URLs like http://... with <http://...> to avoid MD034
"""

import re
import textwrap
from pathlib import Path

ROOT = Path("podium-docs-assets")
MAX_LEN = 120

code_fence_re = re.compile(r"^\s*```\s*$")
url_re = re.compile(r"(?<!\()(?<!<)(https?://[\w\-.:/?#%&=~+;,@\[\]\(\)]+)")
email_re = re.compile(r"(?<!<)([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})(?!>)")
# match lines that are only emphasis (single/double/triple asterisks/underscores)
ultima_re = re.compile(r"^\s*([*_]{1,3})(.+?)\1\s*$", re.IGNORECASE)


# Heuristic to detect code language
def detect_language(block_lines: list[str]) -> str:
    """Detect the likely language for a code block given its first lines."""
    text = "\n".join(block_lines[:10]).lower()
    if text.strip().startswith("{") or '"' in text or '\n"' in text:
        return "json"
    if "```json" in text:
        return "json"
    if (
        "import " in text
        or "export " in text
        or "interface " in text
        or "const " in text
    ):
        return "typescript"
    if (
        text.strip().startswith("$")
        or "npm " in text
        or "yarn " in text
        or "venv" in text
        or "python -m" in text
    ):
        return "bash"
    if "def " in text or "pytest" in text or "python" in text:
        return "python"
    if text.strip().startswith("<") and "html" in text:
        return "html"
    return "bash"


def wrap_line(line: str, width: int = MAX_LEN) -> str:
    # Preserve leading list markers indent
    m = re.match(r"^(\s*[-*+]\s+)(.*)$", line)
    if m:
        prefix = m.group(1)
        rest = m.group(2)
        wrapped = textwrap.fill(rest, width=width - len(prefix))
        return "\n".join(prefix + part for part in wrapped.split("\n"))
    m = re.match(r"^(\s*\d+\.\s+)(.*)$", line)
    if m:
        prefix = m.group(1)
        rest = m.group(2)
        wrapped = textwrap.fill(rest, width=width - len(prefix))
        return "\n".join(prefix + part for part in wrapped.split("\n"))
    # normal paragraph
    return "\n".join(textwrap.fill(line, width=width).split("\n"))


def fix_file(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    lines: list[str] = text.splitlines()
    out_lines: list[str] = []
    i = 0
    changed = False

    while i < len(lines):
        line = lines[i]
        # Replace emphasized 'Última atualização' with heading
        m = ultima_re.match(line)
        if m:
            # m.group(1) is the emphasis markers, m.group(2) is content
            content = m.group(2).strip()
            # replace non-breaking spaces
            content = content.replace("\u00a0", " ")
            out_lines.append("#### " + content)
            changed = True
            i += 1
            continue
        # Handle code fences
        if code_fence_re.match(line):
            # capture indentation for indented fences (e.g., inside list)
            m_indent = re.match(r"^(\s*)```", line)
            indent = m_indent.group(1) if m_indent else ""
            # ensure previous line is blank
            if out_lines and out_lines[-1].strip() != "":
                out_lines.append("")
            # collect block
            i += 1
            block: list[str] = []
            while i < len(lines) and not code_fence_re.match(lines[i]):
                block.append(lines[i])
                i += 1
            # now lines[i] is closing fence or EOF
            # detect language
            lang = detect_language(block)
            out_lines.append(f"{indent}```{lang}")
            out_lines.extend(block)
            if i < len(lines) and code_fence_re.match(lines[i]):
                out_lines.append(f"{indent}```")
                i += 1
            # ensure next line is blank
            out_lines.append("")
            changed = True
            continue
        # Normalize ordered list numbers to '1.' style
        ol_match = re.match(r"^(\s*)(\d+)\.\s+(.*)$", line)
        if ol_match:
            indent = ol_match.group(1)
            content = ol_match.group(3)
            out_line = f"{indent}1. {content}"
            out_lines.append(out_line)
            if out_line != line:
                changed = True
            i += 1
            continue
        # Remove trailing spaces
        new_line = re.sub(r"[ \t]+$", "", line)
        if new_line != line:
            changed = True
        # Replace bare URLs with angle brackets
        new_line = url_re.sub(r"<\1>", new_line)
        # Replace bare emails with angle brackets
        new_line = email_re.sub(r"<\1>", new_line)
        # Collapse multiple blank lines: we'll handle after building
        out_lines.append(new_line)
        i += 1

    # Collapse multiple blank lines
    collapsed: list[str] = []
    blank_count = 0
    for line in out_lines:
        if line.strip() == "":
            blank_count += 1
            if blank_count <= 1:
                collapsed.append(line)
            else:
                changed = True
        else:
            blank_count = 0
            collapsed.append(line)

    # Ensure fenced code blocks are surrounded by blank lines
    fenced: list[str] = []
    for line in collapsed:
        if line.strip().startswith("```"):
            if fenced and fenced[-1].strip() != "":
                fenced.append("")
                changed = True
            fenced.append(line)
        else:
            fenced.append(line)

    # Add blank line after closing fences if missing
    final_lines: list[str] = []
    i = 0
    while i < len(fenced):
        final_lines.append(fenced[i])
        if fenced[i].strip().startswith("```"):
            # find closing fence
            j = i + 1
            while j < len(fenced) and not fenced[j].strip().startswith("```"):
                final_lines.append(fenced[j])
                j += 1
            if j < len(fenced):
                final_lines.append(fenced[j])
                if j + 1 < len(fenced) and fenced[j + 1].strip() != "":
                    final_lines.append("")
                    changed = True
                i = j + 1
                continue
            else:
                i = j
                continue
        i += 1

    # Wrap long lines (>MAX_LEN) for paragraphs and lists (including long reference lines)
    wrapped: list[str] = []
    for line in final_lines:
        # skip headings, tables, fences, image lines
        if len(line) > MAX_LEN and not line.lstrip().startswith(
            ("```", "#", "|", "![]")
        ):
            wrapped.extend(wrap_line(line).split("\n"))
            changed = True
        else:
            wrapped.append(line)

    # Normalize emphasis style: prefer asterisks over underscores
    norm_emphasis: list[str] = []
    for line in wrapped:
        # convert _text_ and __text__ to *text* and **text**
        l_new = re.sub(r"(?P<pre>\W|^)_([^_]+?)_(?P<post>\W|$)", r"\1*\2*\3", line)
        l_new = re.sub(r"(?P<pre>\W|^)__([^_]+?)__(?P<post>\W|$)", r"\1**\2**\3", l_new)
        # remove spaces inside emphasis markers like ** text **
        l_new = re.sub(r"(\*\*|\*)(\s+)([^\*].*?)(\s+)(\1)", r"\1\3\1", l_new)
        # replace non-breaking spaces inside emphasis
        l_new = l_new.replace("\u00a0", " ")
        if l_new != line:
            changed = True
        norm_emphasis.append(l_new)

    # Fix spaces inside emphasis markers produced by NBSP issues
    fixed_emphasis: list[str] = []
    for line in norm_emphasis:
        l_new = re.sub(r"(\*\*|\*)(\s+)([^\*].*?)(\s+)(\1)", r"\1\3\1", line)
        fixed_emphasis.append(l_new)
    # Normalize list indentation for top-level lists (remove 2-space indents)
    dedented: list[str] = []
    prev_nonblank = ""
    for line in fixed_emphasis:
        m = re.match(r"^(\s{2})(?:([-*+]\s+)|(\d+\.\s+))(.*)$", line)
        if m and (prev_nonblank == "" or prev_nonblank.lstrip().startswith("#")):
            marker = m.group(2) if m.group(2) else m.group(3)
            content = m.group(4)
            new_l = f"{marker}{content}"
            dedented.append(new_l)
            changed = True
        else:
            dedented.append(line)
        if line.strip() != "":
            prev_nonblank = line

    # Ensure blank lines around headings and lists
    final_pass: list[str] = []
    i = 0
    while i < len(dedented):
        line = dedented[i]
        # Headings: ensure blank line before and after
        h = re.match(r"^(#+)\s+(.+)$", line)
        if h:
            # remove trailing punctuation from heading
            content = h.group(2).rstrip()
            # remove trailing punctuation and stray asterisks introduced by malformed emphasis
            content = re.sub(r"[:.]+$", "", content).rstrip()
            content = re.sub(r"\*+$", "", content).rstrip()
            level = len(h.group(1))
            # limit heading jump to +1 from previous
            prev_level = 0
            # find previous heading level
            for j in range(len(final_pass) - 1, -1, -1):
                ph = re.match(r"^(#+)\s+", final_pass[j])
                if ph:
                    prev_level = len(ph.group(1))
                    break
            if prev_level and level > prev_level + 1:
                level = prev_level + 1
                changed = True
            new_heading = f"{'#' * level} {content}"
            if final_pass and final_pass[-1].strip() != "":
                final_pass.append("")
                changed = True
            final_pass.append(new_heading)
            # ensure a blank line after heading if next is not blank
            if i + 1 < len(dedented) and dedented[i + 1].strip() != "":
                final_pass.append("")
                changed = True
            i += 1
            continue
        # Lists: ensure blank line before list blocks
        if re.match(r"^\s*([*-+]\s+|1\.\s+)", line):
            if final_pass and final_pass[-1].strip() != "":
                final_pass.append("")
                changed = True
            # append consecutive list lines
            while i < len(dedented) and re.match(r"^\s*([*-+]\s+|1\.\s+)", dedented[i]):
                final_pass.append(dedented[i])
                i += 1
            # ensure a blank line after the list if next is not blank
            if i < len(dedented) and dedented[i].strip() != "":
                final_pass.append("")
                changed = True
            continue
        final_pass.append(line)
        i += 1

    # Normalize simple markdown tables: reformat header and rows to consistent style
    table_fixed: list[str] = []
    i = 0
    while i < len(final_pass):
        line = final_pass[i]
        # detect header with pipes and next line that looks like a separator
        if (
            "|" in line
            and i + 1 < len(final_pass)
            and re.match(r"^\s*\|?\s*[:\- ]+\|", final_pass[i + 1])
        ):
            # parse header cells
            raw_cells: list[str] = [
                c.strip() for c in line.split("|") if c.strip() != ""
            ]
            cols = len(raw_cells)
            header_line = "| " + " | ".join(raw_cells) + " |"
            sep_line = "| " + " | ".join(["---"] * cols) + " |"
            table_fixed.append(header_line)
            table_fixed.append(sep_line)
            # skip original sep line
            i += 2
            # append following table rows until a blank line
            while i < len(final_pass) and final_pass[i].strip() != "":
                row_cells: list[str] = [
                    c.strip() for c in final_pass[i].split("|") if c.strip() != ""
                ]
                # pad or truncate to match header cols
                if len(row_cells) < cols:
                    row_cells += [""] * (cols - len(row_cells))
                row_line = "| " + " | ".join(row_cells[:cols]) + " |"
                table_fixed.append(row_line)
                i += 1
            continue
        table_fixed.append(line)
        i += 1

    if changed:
        path.write_text("\n".join(table_fixed) + "\n", encoding="utf-8")
    return changed


def main():
    md_files: list[Path] = list(ROOT.rglob("*.md"))
    print(f"Found {len(md_files)} markdown files to check.")
    total_changed = 0
    for f in md_files:
        changed = fix_file(f)
        if changed:
            print(f"Fixed: {f.relative_to(ROOT)}")
            total_changed += 1
    print(f"Done. Files changed: {total_changed}")


if __name__ == "__main__":
    main()
