import sys, re, os

# Known mojibake -> correct unicode mapping
# These are UTF-8 emojis incorrectly decoded as latin-1/cp1252
REPLACEMENTS = {
    # Crown 👑  U+1F451
    'ðŸ''': '👑',
    # Heart with ribbon 💗 U+1F497
    'ðŸ'—': '💗',
    # Eagle 🦅 U+1F985
    'ðŸ¦…': '🦅',
    # Star ⭐ U+2B50
    'â­': '⭐',
    # Fire 🔥 U+1F525
    'ðŸ"¥': '🔥',
    # Trophy 🏆 U+1F3C6
    'ðŸ†': '🏆',
    # Medal 🏅 U+1F3C5
    'ðŸ…': '🏅',
    # Medal 🎖 U+1F396
    'ðŸŽ–': '🎖',
    # Target/Bullseye 🎯 U+1F3AF
    'ðŸŽ¯': '🎯',
    # Soccer ball ⚽ U+26BD
    'â½': '⚽',
    # TV 📺 U+1F4FA
    'ðŸ"º': '📺',
    # Camera 📸 U+1F4F8
    'ðŸ"¸': '📸',
    # Speech bubble 💬 U+1F4AC
    'ðŸ'¬': '💬',
    # Mobile phone 📱 U+1F4F1
    'ðŸ"±': '📱',
    # Red heart ❤ U+2764
    'â¤': '❤',
    # Yellow heart 💛 U+1F49B
    'ðŸ'›': '💛',
    # Globe 🌍 U+1F30D
    'ðŸŒ': '🌍',
    # Email 📧 U+1F4E7
    'ðŸ"§': '📧',
    # Phone 📞 U+1F4DE
    'ðŸ"ž': '📞',
    # House 🏠 U+1F3E0
    'ðŸ ': '🏠',
    # Star 🌟 U+1F31F
    'ðŸŒŸ': '🌟',
    # Sparkles 💫 U+1F4AB
    'ðŸ'«': '💫',
    # Red circle 🔴 U+1F534
    'ðŸ"´': '🔴',
    # Yellow circle 🟡 U+1F7E1
    'ðŸŸ¡': '🟡',
    # Moon 🌙 U+1F319
    'ðŸŒ™': '🌙',
    # Lightning ⚡ U+26A1
    'âš¡': '⚡',
    # Sun ☀ U+2600
    'â˜€': '☀️',
    # Diamond ♦ U+2666
    'â™¦': '♦',
    # Star ★ U+2605
    'â˜…': '★',
    # Star ✦ U+2726
    'âœ¦': '✦',
    # Film 🎬 U+1F3AC
    'ðŸŽ¬': '🎬',
    # Crown again (alternate encoding)
    '\u00f0\u009f\u0091\u0091': '👑',
    # Check mark ✅ U+2705
    'âœ…': '✅',
    # Family 👨‍👩‍👧‍👦
    'ðŸ'¨': '👨',
    # Clap 👏 U+1F44F  
    'ðŸ'': '👏',
    # Raised hands 🙌
    'ðŸ™Œ': '🙌',
    # Handshake 🤝
    'ðŸ¤': '🤝',
    # Music 🎵
    'ðŸŽµ': '🎵',
    # Microphone 🎤
    'ðŸŽ¤': '🎤',
    # Calendar 📅
    'ðŸ"…': '📅',
    # Clock ⏰
    'â°': '⏰',
    # Link 🔗
    'ðŸ"—': '🔗',
    # Pin 📍
    'ðŸ"': '📍',
    # Envelope ✉
    'âœ‰': '✉️',
    # Globe showing Europe-Africa 🌍
    'ðŸŒ': '🌍',
    # Thumbs up 👍
    'ðŸ'': '👍',
    # Wave 👋
    'ðŸ'‹': '👋',
    # Info ℹ
    'â„¹': 'ℹ️',
    # Warning ⚠
    'âš ': '⚠️',
    # Checkmark ✓
    'âœ"': '✓',
    # Cross ✗  
    'âœ—': '✗',
    # Bullet •
    'â€¢': '•',
    # Em dash —
    'â€"': '—',
    # En dash –  
    'â€"': '–',
    # Left quote '
    'â€˜': '\u2018',
    # Right quote '
    'â€™': '\u2019',
    # Left double quote "
    'â€œ': '\u201c',
    # Right double quote "
    'â€': '\u201d',
    # Ellipsis …
    'â€¦': '\u2026',
    # Non-breaking space
    'Â\xa0': '\xa0',
    'Â ': ' ',
}

files = ['index.html', 'about.html', 'contact.html', 'gallery.html', 'archives.html', 'outreach.html']

for fname in files:
    if not os.path.exists(fname):
        continue
    with open(fname, encoding='utf-8') as fh:
        content = fh.read()
    
    original = content
    for wrong, right in REPLACEMENTS.items():
        content = content.replace(wrong, right)
    
    if content != original:
        # Count changes
        changes = sum(original.count(w) for w in REPLACEMENTS if w in original)
        with open(fname, 'w', encoding='utf-8') as fh:
            fh.write(content)
        print(f'Fixed {fname}: ~{changes} replacements')
    else:
        print(f'Clean: {fname}')

print('Done.')
