export const mockExtensions = [
  {
    id: '1',
    name: 'Dark Reader',
    description: 'すべてのウェブサイトにダークモードを適用',
    longDescription: 'Dark Readerは、すべてのウェブサイトにダークテーマを適用する拡張機能です。目に優しく、夜間の閲覧に最適です。カラーフィルター、フォント設定、明るさ調整など、豊富なカスタマイズオプションを提供します。',
    icon: 'https://img.icons8.com/color/96/moon-symbol.png',
    screenshots: [
      'https://img.icons8.com/color/400/dark-mode.png',
      'https://img.icons8.com/color/400/settings.png'
    ],
    category: '外観',
    downloads: 125430,
    rating: 4.8,
    reviewCount: 2341,
    featured: true,
    downloadUrl: 'https://example.com/dark-reader.crx',
    createdAt: Date.now() - 86400000 * 30,
    tabId: '1'
  },
  {
    id: '2',
    name: 'AdBlock Plus',
    description: '広告をブロックして快適なブラウジング',
    longDescription: 'AdBlock Plusは、煩わしい広告を自動的にブロックします。ページの読み込み速度が向上し、プライバシーも保護されます。',
    icon: 'https://img.icons8.com/color/96/block.png',
    screenshots: [
      'https://img.icons8.com/color/400/block-ads.png'
    ],
    category: 'プライバシー',
    downloads: 234567,
    rating: 4.6,
    reviewCount: 5432,
    featured: true,
    downloadUrl: 'https://example.com/adblock.crx',
    createdAt: Date.now() - 86400000 * 60
  },
  {
    id: '3',
    name: 'Grammarly',
    description: '英文法とスペルチェッカー',
    longDescription: 'Grammarlyは、リアルタイムで文法やスペルミスを検出し、より良い文章を書くための提案を提供します。',
    icon: 'https://img.icons8.com/color/96/grammar.png',
    screenshots: [
      'https://img.icons8.com/color/400/text.png'
    ],
    category: '生産性',
    downloads: 189234,
    rating: 4.7,
    reviewCount: 3210,
    featured: false,
    downloadUrl: 'https://example.com/grammarly.crx',
    createdAt: Date.now() - 86400000 * 45
  },
  {
    id: '4',
    name: 'LastPass',
    description: 'パスワードマネージャー',
    longDescription: 'LastPassは、すべてのパスワードを安全に保存し、自動入力します。強力な暗号化でデータを保護します。',
    icon: 'https://img.icons8.com/color/96/password.png',
    screenshots: [
      'https://img.icons8.com/color/400/password-window.png'
    ],
    category: 'セキュリティ',
    downloads: 167890,
    rating: 4.5,
    reviewCount: 2876,
    featured: false,
    downloadUrl: 'https://example.com/lastpass.crx',
    createdAt: Date.now() - 86400000 * 90
  },
  {
    id: '5',
    name: 'Honey',
    description: '自動クーポン検索でお得に買い物',
    longDescription: 'Honeyは、オンラインショッピング中に自動的にクーポンコードを検索して適用します。',
    icon: 'https://img.icons8.com/color/96/honey.png',
    screenshots: [
      'https://img.icons8.com/color/400/shopping-cart.png'
    ],
    category: 'ショッピング',
    downloads: 98765,
    rating: 4.9,
    reviewCount: 1543,
    featured: true,
    downloadUrl: 'https://example.com/honey.crx',
    createdAt: Date.now() - 86400000 * 20
  },
  {
    id: '6',
    name: 'Momentum',
    description: '美しい新しいタブページ',
    longDescription: 'Momentumは、新しいタブを美しい写真とモチベーションを高める名言で飾ります。ToDoリストや天気情報も表示できます。',
    icon: 'https://img.icons8.com/color/96/mountain.png',
    screenshots: [
      'https://img.icons8.com/color/400/landscape.png'
    ],
    category: '外観',
    downloads: 76543,
    rating: 4.8,
    reviewCount: 987,
    featured: false,
    downloadUrl: 'https://example.com/momentum.crx',
    createdAt: Date.now() - 86400000 * 15
  },
  {
    id: '7',
    name: 'ColorZilla',
    description: 'カラーピッカーとグラデーションジェネレーター',
    longDescription: 'ColorZillaは、ウェブページ上の任意の色を取得できる高度なカラーピッカーです。グラデーション作成機能も搭載。',
    icon: 'https://img.icons8.com/color/96/color-palette.png',
    screenshots: [
      'https://img.icons8.com/color/400/paint-palette.png'
    ],
    category: '開発者ツール',
    downloads: 54321,
    rating: 4.6,
    reviewCount: 654,
    featured: false,
    downloadUrl: 'https://example.com/colorzilla.crx',
    createdAt: Date.now() - 86400000 * 50
  },
  {
    id: '8',
    name: 'Video Speed Controller',
    description: '動画の再生速度を自由に調整',
    longDescription: 'Video Speed Controllerは、HTML5動画の再生速度を簡単に調整できます。学習効率を高めたい方に最適です。',
    icon: 'https://img.icons8.com/color/96/video.png',
    screenshots: [
      'https://img.icons8.com/color/400/play-button.png'
    ],
    category: '生産性',
    downloads: 43210,
    rating: 4.7,
    reviewCount: 432,
    featured: false,
    downloadUrl: 'https://example.com/video-speed.crx',
    createdAt: Date.now() - 86400000 * 10
  }
]

export const mockReviews = [
  {
    id: '1',
    extensionId: '1',
    rating: 5,
    comment: '素晴らしい拡張機能です！目が疲れなくなりました。',
    author: 'ユーザー1',
    createdAt: Date.now() - 86400000 * 5
  },
  {
    id: '2',
    extensionId: '1',
    rating: 5,
    comment: 'ダークモード最高！すべてのサイトで使えるのが便利です。',
    author: 'ユーザー2',
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: '3',
    extensionId: '1',
    rating: 4,
    comment: 'とても良いですが、たまに色が変になるサイトがあります。',
    author: 'ユーザー3',
    createdAt: Date.now() - 86400000 * 1
  },
  {
    id: '4',
    extensionId: '2',
    rating: 5,
    comment: '広告がなくなって快適です！',
    author: 'ユーザー4',
    createdAt: Date.now() - 86400000 * 7
  },
  {
    id: '5',
    extensionId: '5',
    rating: 5,
    comment: 'クーポンを自動で見つけてくれるので、節約できます！',
    author: 'ユーザー5',
    createdAt: Date.now() - 86400000 * 2
  }
]

export const categories = [
  'すべて',
  '外観',
  'プライバシー',
  '生産性',
  'セキュリティ',
  'ショッピング',
  '開発者ツール',
  'その他'
]
