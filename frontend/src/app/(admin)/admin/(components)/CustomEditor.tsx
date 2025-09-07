// src/app/admin/(components)/CustomEditor.tsx
"use client";

import { useEffect, useRef, useState } from 'react';

interface CKEditorLoader {
  file: Promise<File>;
}

class MyUploadAdapter {
    private loader: CKEditorLoader;
    private apiUrl: string;

    constructor(loader: CKEditorLoader) {
        this.loader = loader;
        this.apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/gallery/ckeditor`;
    }

    upload() {
        return this.loader.file
            .then((file: File) => new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append('upload', file); 
                fetch(this.apiUrl, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                    }
                })
                .then(res => {
                    console.log('CKEditor upload response status:', res.status, res.statusText);
                    if (!res.ok) {
                        return res.json().then(data => {
                            console.error('CKEditor upload failed with server response:', data);
                            reject(data.error?.message || data.message || `Server error: ${res.status} ${res.statusText}`);
                        }).catch(() => {
                            reject(`Server error: ${res.status} ${res.statusText}`);
                        });
                    }
                    return res.json();
                })
                .then(data => {
                    if (data && data.url) {
                        resolve({
                            default: `${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:3000'}${data.url}`
                        });
                    } else {
                        reject('Invalid response from server: URL not found.');
                    }
                })
                .catch(error => {
                    console.error('CKEditor upload network error:', error);
                    reject(error.message || 'Network error during upload. Check console for details.');
                });
            }));
    }
    abort() {
        console.log('Upload aborted.');
    }
}

interface CKEditorInstance {
  plugins: {
    get: (pluginName: string) => {
      createUploadAdapter: (loader: CKEditorLoader) => MyUploadAdapter;
    };
  };
}

function MyCustomUploadAdapterPlugin(editor: CKEditorInstance) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: CKEditorLoader) => {
    return new MyUploadAdapter(loader);
  };
}

interface EditorProps {
    onChange: (data: string) => void;
    initialData?: string;
}

const Editor = ({ onChange, initialData = "" }: EditorProps) => {
    const editorRef = useRef<{
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        CKEditor: React.ComponentType<any>;
        ClassicEditor: unknown
    } | null>(null);
    const [isEditorLoaded, setIsEditorLoaded] = useState(false);

    useEffect(() => {
        import('@ckeditor/ckeditor5-react').then(ckeditorModule => {
            import('@ckeditor/ckeditor5-build-classic').then(classicEditorModule => {
                editorRef.current = {
                    CKEditor: ckeditorModule.CKEditor,
                    ClassicEditor: classicEditorModule.default,
                };
                setIsEditorLoaded(true);
            });
        });
        return () => {
            setIsEditorLoaded(false);
            editorRef.current = null;
        };
    }, []);

    if (!isEditorLoaded || !editorRef.current) {
        return <div className="p-4 border border-slate/20 rounded-md bg-light-gray min-h-[200px]">Loading editor...</div>;
    }

    const { CKEditor, ClassicEditor } = editorRef.current;
    
    return (
        <CKEditor
            editor={ClassicEditor}
            data={initialData}
            config={{
                extraPlugins: [MyCustomUploadAdapterPlugin],
            }}
            onChange={(event: unknown, editor: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                onChange(editor.getData());
            }}
        />
    );
};

export default Editor;