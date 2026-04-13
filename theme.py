import os, re

dir_paths = [r"C:\Users\Anathapadmanabhan\Desktop\checkin-pwa\app", r"C:\Users\Anathapadmanabhan\Desktop\checkin-pwa\components"]

replacements = {
    # Text colors
    r"text-slate-50\b": "text-slate-900",
    r"text-slate-100\b": "text-slate-800",
    r"text-slate-200\b": "text-slate-700",
    r"text-slate-300\b": "text-slate-600",
    r"text-slate-400\b": "text-slate-500",
    
    # Background colors
    r"bg-surface-950\b": "bg-surface-50",
    r"bg-surface-900\b": "bg-surface-100",
    r"bg-surface-800\b": "bg-white",
    
    # Borders
    r"border-white/10\b": "border-black/10",
    r"border-white/8\b": "border-black/5",
    
    # Translucent backgrounds
    r"bg-white/5\b": "bg-black/5",
    r"bg-white/10\b": "bg-black/10",
    r"bg-white/15\b": "bg-black/10",
    
    # Gradients
    r"to-violet-800/20\b": "to-brand-500/10",
    r"to-violet-600\b": "to-brand-500",
    
    # Specific component tweaks
    r"text-brand-300\b": "text-brand-600",
    r"text-brand-400\b": "text-brand-600",
    r"from-brand-600\b": "from-brand-500",
    r"from-brand-700/30\b": "from-brand-500/20",
    r"bg-brand-600/40\b": "bg-brand-500/20",
    r"bg-brand-600/50\b": "bg-brand-500/20",
    r"border-brand-500/20\b": "border-brand-500/30",
    
    # Layout background
    r"bg-surface-950\b": "bg-surface-50",
}

for d in dir_paths:
    if not os.path.exists(d):
        continue
    for root, _, files in os.walk(d):
        for f in files:
            if f.endswith('.tsx') or f.endswith('.ts'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                original_content = content
                
                for k, v in replacements.items():
                    content = re.sub(k, v, content)
                
                if content != original_content:
                    print(f"Updated {path}")
                    with open(path, 'w', encoding='utf-8') as file:
                        file.write(content)
