const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  showNotification: (title: string, body: string, tag?: string) =>
    ipcRenderer.invoke('show-notification', { title, body, tag }),
  
  dbGet: (key: string) =>
    ipcRenderer.invoke('db-get', key),
  
  dbSet: (key: string, value: any) =>
    ipcRenderer.invoke('db-set', key, value),
})

declare global {
  interface Window {
    electronAPI: {
      showNotification: (title: string, body: string, tag?: string) => Promise<boolean>
      dbGet: (key: string) => Promise<any>
      dbSet: (key: string, value: any) => Promise<boolean>
    }
  }
}
