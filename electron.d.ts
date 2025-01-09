declare namespace Electron {
    interface SaveDialogReturnValue {
      canceled: boolean
      filePath?: string
    }
  
    interface SaveDialogOptions {
      title?: string
      defaultPath?: string
      filters?: {
        name: string
        extensions: string[]
      }[]
    }
  }