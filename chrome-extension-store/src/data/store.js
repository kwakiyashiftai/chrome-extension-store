import { supabase } from '../lib/supabase'

// 初期化（テーブルは既にSupabaseで作成済み）
export const initializeStore = async () => {
  // テーブルが空の場合のみデフォルトデータを追加する処理は不要
  // Supabase側でデフォルトデータは既に挿入済み
  return true
}

// ファイルアップロード関連
export const uploadFile = async (file, bucketName, filePath) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath)

    return urlData.publicUrl
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

// Base64からBlobに変換してアップロード
export const uploadBase64File = async (base64String, bucketName, filePath) => {
  try {
    // Base64からBlobに変換
    const base64Data = base64String.split(',')[1]
    const mimeType = base64String.split(',')[0].split(':')[1].split(';')[0]
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const blob = new Blob([byteArray], { type: mimeType })

    return await uploadFile(blob, bucketName, filePath)
  } catch (error) {
    console.error('Error uploading base64 file:', error)
    throw error
  }
}

// Extensions関連
export const getAllExtensions = async () => {
  try {
    const { data, error } = await supabase
      .from('extensions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching extensions:', error)
    return []
  }
}

export const getExtensionById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('extensions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching extension:', error)
    return null
  }
}

export const addExtension = async (extension) => {
  try {
    const timestamp = Date.now()
    const extensionId = `ext_${timestamp}`

    // アイコンをアップロード
    let iconUrl = extension.icon
    if (extension.icon && extension.icon.startsWith('data:')) {
      iconUrl = await uploadBase64File(
        extension.icon,
        'images',
        `icons/${extensionId}.png`
      )
    }

    // スクリーンショットをアップロード
    const screenshotUrls = []
    if (extension.screenshots && extension.screenshots.length > 0) {
      for (let i = 0; i < extension.screenshots.length; i++) {
        const screenshot = extension.screenshots[i]
        if (screenshot.startsWith('data:')) {
          const url = await uploadBase64File(
            screenshot,
            'images',
            `screenshots/${extensionId}_${i}.png`
          )
          screenshotUrls.push(url)
        } else {
          screenshotUrls.push(screenshot)
        }
      }
    }

    // ZIPファイルをアップロード
    let zipFileUrl = extension.downloadUrl
    let zipFileName = extension.zipFileName
    if (extension.zipFile) {
      zipFileUrl = await uploadFile(
        extension.zipFile,
        'extensions-files',
        `${extensionId}/${extension.zipFile.name}`
      )
      zipFileName = extension.zipFile.name
    }

    const { data, error } = await supabase
      .from('extensions')
      .insert([{
        name: extension.name,
        description: extension.description,
        long_description: extension.longDescription,
        category: extension.category,
        download_url: zipFileUrl,
        featured: extension.featured || false,
        icon: iconUrl,
        screenshots: screenshotUrls,
        zip_file_url: zipFileUrl,
        zip_file_name: zipFileName,
        discord_name: extension.discordName,
        email: extension.email,
        tab_id: extension.tabId || '1',
        downloads: 0,
        rating: 0,
        review_count: 0
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error adding extension:', error)
    throw error
  }
}

export const incrementDownloads = async (id) => {
  try {
    const extension = await getExtensionById(id)
    if (!extension) return null

    const { data, error } = await supabase
      .from('extensions')
      .update({ downloads: extension.downloads + 1 })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error incrementing downloads:', error)
    return null
  }
}

export const deleteExtension = async (id) => {
  try {
    // レビューはCASCADE削除されるので、拡張機能のみ削除
    const { error } = await supabase
      .from('extensions')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting extension:', error)
    return false
  }
}

// Reviews関連
export const getAllReviews = async () => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}

export const getReviewsByExtensionId = async (extensionId) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('extension_id', extensionId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return []
  }
}

export const addReview = async (review) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{
        extension_id: review.extensionId,
        rating: review.rating,
        comment: review.comment,
        author: review.author
      }])
      .select()
      .single()

    if (error) throw error

    // 拡張機能の評価を更新
    await updateExtensionRating(review.extensionId)

    return data
  } catch (error) {
    console.error('Error adding review:', error)
    throw error
  }
}

export const deleteReview = async (reviewId, extensionId) => {
  try {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)

    if (error) throw error

    // 拡張機能の評価を更新
    await updateExtensionRating(extensionId)

    return true
  } catch (error) {
    console.error('Error deleting review:', error)
    return false
  }
}

// 評価の更新（内部関数）
const updateExtensionRating = async (extensionId) => {
  try {
    const reviews = await getReviewsByExtensionId(extensionId)

    if (reviews.length === 0) {
      // レビューがない場合は0にリセット
      await supabase
        .from('extensions')
        .update({ rating: 0, review_count: 0 })
        .eq('id', extensionId)
      return
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length

    await supabase
      .from('extensions')
      .update({
        rating: Math.round(averageRating * 10) / 10,
        review_count: reviews.length
      })
      .eq('id', extensionId)

  } catch (error) {
    console.error('Error updating extension rating:', error)
  }
}

// 検索とフィルタリング
export const searchExtensions = async (query, category = 'すべて', sortBy = 'downloads') => {
  try {
    let supabaseQuery = supabase.from('extensions').select('*')

    // カテゴリフィルター
    if (category && category !== 'すべて') {
      supabaseQuery = supabaseQuery.eq('category', category)
    }

    // 検索クエリフィルター
    if (query) {
      // Supabaseのテキスト検索を使用
      supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,long_description.ilike.%${query}%`)
    }

    // ソート
    switch (sortBy) {
      case 'downloads':
        supabaseQuery = supabaseQuery.order('downloads', { ascending: false })
        break
      case 'rating':
        supabaseQuery = supabaseQuery.order('rating', { ascending: false })
        break
      case 'newest':
        supabaseQuery = supabaseQuery.order('created_at', { ascending: false })
        break
      default:
        supabaseQuery = supabaseQuery.order('created_at', { ascending: false })
        break
    }

    const { data, error } = await supabaseQuery

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error searching extensions:', error)
    return []
  }
}

// Tabs関連
export const getAllTabs = async () => {
  try {
    const { data, error } = await supabase
      .from('tabs')
      .select('*')
      .order('order', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching tabs:', error)
    return []
  }
}

export const addTab = async (name) => {
  try {
    const tabs = await getAllTabs()
    const newOrder = tabs.length

    const { data, error } = await supabase
      .from('tabs')
      .insert([{
        id: Date.now().toString(),
        name,
        order: newOrder
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error adding tab:', error)
    throw error
  }
}

export const deleteTab = async (id) => {
  try {
    // タブを削除
    const { error: deleteError } = await supabase
      .from('tabs')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    // 残りのタブのorderを再調整
    const tabs = await getAllTabs()
    for (let i = 0; i < tabs.length; i++) {
      if (tabs[i].order !== i) {
        await supabase
          .from('tabs')
          .update({ order: i })
          .eq('id', tabs[i].id)
      }
    }

    return true
  } catch (error) {
    console.error('Error deleting tab:', error)
    return false
  }
}

export const updateTab = async (id, name) => {
  try {
    const { data, error } = await supabase
      .from('tabs')
      .update({ name })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating tab:', error)
    return null
  }
}

// Categories関連
export const getAllCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export const addCategory = async (name, displayOrder = null) => {
  try {
    // display_orderが指定されていない場合、最後に追加
    let order = displayOrder
    if (order === null) {
      const categories = await getAllCategories()
      order = categories.length
    }

    const { data, error } = await supabase
      .from('categories')
      .insert([{
        name,
        display_order: order
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error adding category:', error)
    throw error
  }
}

export const updateCategory = async (id, name, displayOrder) => {
  try {
    const updates = {}
    if (name !== undefined) updates.name = name
    if (displayOrder !== undefined) updates.display_order = displayOrder

    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating category:', error)
    throw error
  }
}

export const deleteCategory = async (id) => {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)

    if (error) throw error

    // display_orderを再調整
    const categories = await getAllCategories()
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].display_order !== i) {
        await updateCategory(categories[i].id, undefined, i)
      }
    }

    return true
  } catch (error) {
    console.error('Error deleting category:', error)
    return false
  }
}

// Home Settings関連
export const getHomeSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('home_settings')
      .select('*')
      .eq('id', 1)
      .single()

    if (error) throw error
    return data || { title: 'SHIFTAI会員限定ストア', subtitle: 'あなたのブラウジング体験をパワーアップ✨', banner_image: '' }
  } catch (error) {
    console.error('Error fetching home settings:', error)
    return { title: 'SHIFTAI会員限定ストア', subtitle: 'あなたのブラウジング体験をパワーアップ✨', banner_image: '' }
  }
}

export const updateHomeSettings = async (settings) => {
  try {
    // バナー画像をアップロード
    let bannerImageUrl = settings.bannerImage
    if (settings.bannerImage && settings.bannerImage.startsWith('data:')) {
      bannerImageUrl = await uploadBase64File(
        settings.bannerImage,
        'extension-assets',
        `banners/home_banner_${Date.now()}.png`
      )
    }

    const { data, error } = await supabase
      .from('home_settings')
      .update({
        title: settings.title,
        subtitle: settings.subtitle,
        banner_image: bannerImageUrl
      })
      .eq('id', 1)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating home settings:', error)
    throw error
  }
}
