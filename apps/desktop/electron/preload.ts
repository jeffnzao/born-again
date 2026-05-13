import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  sendNotification: (title: string, body: string) =>
    ipcRenderer.send('show-notification', { title, body }),
})

declare global {
  interface Window {
    electronAPI: {
      sendNotification: (title: string, body: string) => void
    }
  }
}
