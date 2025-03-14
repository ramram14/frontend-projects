'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'
import Strike from '@tiptap/extension-strike'
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Italic, ListCollapse, ListOrdered, Strikethrough, UnderlineIcon, Image as ImageIcon } from 'lucide-react'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import OrderedList from '@tiptap/extension-ordered-list'
import { Level } from '@tiptap/extension-heading';
import { useEffect } from 'react'
import { Editor, JSONContent } from '@tiptap/core';
import Image from '@tiptap/extension-image'
import { debounce } from 'lodash'
import privateApi from '@/lib/api/private.api'
import { handleAxiosError } from '@/lib/utils'
import toast from 'react-hot-toast'


interface TiptapProps {
  onChange: (content: JSONContent) => void
  value: JSONContent
}

const CustomImage = Image.extend({
  addStorage() {
    return {
      images: [] as string[],
    }
  },
})

const Tiptap = ({ onChange, value }: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Strike,
      Document,
      Paragraph,
      Text,
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      OrderedList,
      CustomImage.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: 'object-contain h-auto max-h-[300px] w-fit max-w-full mx-auto border-2',
        },
      })
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none',
      }
    },
    content: value || '<p>Hello World! 🌎️</p>',
    onUpdate({ editor }) {
      const image = new Set<string>();
      editor.state.doc.descendants((node) => {
        if (node.type.name === 'image') {
          image.add(node.attrs.src);
        }
      });
      editor.storage.image.images = Array.from(image);
    }
  })

  useEffect(() => {
    if (!editor) {
      return
    }

    if (!editor.storage.image) {
      editor.storage.image = { images: [] }
    }

    const handleDeleteImage = () => {
      const currentImages = new Set<string>();
      const previousImages = new Set<string>(editor.storage.image?.images || []);

      editor.state.doc.descendants((node) => {
        if (node.type.name === 'image') {
          currentImages.add(node.attrs.src);
        }
      })


      // Loop through previous images and delete if not in current images
      previousImages.forEach(async (image) => {
        if (!currentImages.has(image)) {
          try {
            await privateApi.delete(`/images`, {
              data: {
                imageUrl: image,
              },
            });
          } catch (error) {
            const errorMessage = handleAxiosError(error);
            toast(errorMessage, {duration: 5000});
          }
        }
      })

      editor.storage.image.images = Array.from(currentImages);
    }

    const debounceHandleDeleteImage = debounce((editor: Editor) => {
      const content = editor.getJSON()
      onChange(content)
      handleDeleteImage()
    }, 500)

    editor.on('update', ({ editor }) => {
      debounceHandleDeleteImage(editor)
    })


    if (value !== editor.getJSON()) {
      const scrollY = window.scrollY;
      // This handles scroll position restoration
      requestAnimationFrame(() => {
        editor.commands.setContent(value, false);
      });
      window.scrollTo(0, scrollY);
    }

    return () => {
      debounceHandleDeleteImage.cancel()
      editor.off('update')
    }



  }, [editor, onChange, value])


  if (!editor) {
    return null
  }

  return (
    <div className='border-2 min-h-96' >
      <div className="toolbar w-full space-x-2 md:space-x-4 p-2 border-b-2 sticky top-0 bg-white z-50">
        <select
          aria-label="Heading Level"
          name="level"
          id="level"
          onChange={(e) => {
            const level = parseInt(e.target.value, 10);
            editor.chain().focus().toggleHeading({ level: level as Level }).run();
          }}
          className="p-1 md:p-2 text-xs md:text-lg rounded-md border bg-white text-gray-800 cursor-pointer "
          value={
            [1, 2, 3, 4, 5, 6].find((level) => editor.isActive('heading', { level })) || ''
          }
        >
          <option value="" disabled>
            Select Heading
          </option>
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
          <option value="5">Heading 5</option>
          <option value="6">Heading 6</option>
        </select>
        <button type='button' role="none" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`p-1 md:p-2 rounded-md ${editor.isActive('bold') ? 'bg-slate-600 text-white' : ''}`}>
          <Bold className='w-4 h-4 md:w-6 md:h-6' />
        </button>
        <button type='button' role="none" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`p-1 md:p-2 rounded-md ${editor.isActive('italic') ? 'bg-slate-600 text-white' : ''}`}>
          <Italic className='w-4 h-4 md:w-6 md:h-6' />
        </button>
        <button
          type="button"
          aria-label='Underline'
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1 md:p-2 rounded-md ${editor.isActive('underline') ? 'bg-slate-600 text-white' : ''}`}
        >
          <UnderlineIcon className='w-4 h-4 md:w-6 md:h-6' />
        </button>
        <button type='button' role="none" onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`p-1 md:p-2 rounded-md ${editor.isActive('strike') ? 'bg-slate-600 text-white' : ''}`}>
          <Strikethrough className='w-4 h-4 md:w-6 md:h-6' />
        </button>
        <button
          type='button'
          aria-label='Bullet list'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 md:p-2 rounded-md ${editor.isActive('bulletList') ? 'bg-slate-600 text-white' : ''}`}
        >
          <ListCollapse className='w-4 h-4 md:w-6 md:h-6' />
        </button>
        <button
          type="button"
          aria-label='Order list'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 md:p-2 rounded-md ${editor.isActive('orderedList') ? 'bg-slate-600 text-white' : ''}`}
        >
          <ListOrdered className='w-4 h-4 md:w-6 md:h-6' />
        </button>
        <button
          type="button"
          aria-label='Align left'
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`p-1 md:p-2 rounded-md ${editor.isActive({ textAlign: 'left' }) ? 'bg-slate-600 text-white' : ''}`}
        >
          <AlignLeft className='w-4 h-4 md:w-6 md:h-6' />
        </button>
        <button
          type='button'
          aria-label='Align center'
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`p-1 md:p-2 rounded-md ${editor.isActive({ textAlign: 'center' }) ? 'bg-slate-600 text-white' : ''}`}
        >
          <AlignCenter className='w-4 h-4 md:w-6 md:h-6' />
        </button>
        <button
          aria-label='Align right'
          type='button'
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`p-1 md:p-2 rounded-md ${editor.isActive({ textAlign: 'right' }) ? 'bg-slate-600 text-white' : ''}`}
        >
          <AlignRight className='w-4 h-4 md:w-6 md:h-6' />
        </button>
        <button
          aria-label='Align justify'
          type='button'
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`p-1 md:p-2 rounded-md ${editor.isActive({ textAlign: 'justify' }) ? 'bg-slate-600 text-white' : ''}`}
        >
          <AlignJustify className='w-4 h-4 md:w-6 md:h-6' />
        </button>


        {/* Image */}
        <button
          aria-label='Align justify'
          type='button'
          className={`p-1 md:p-2 rounded-md 'bg-slate-600 `}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (event) => {
              try {
                const formData = new FormData()
                const file = (event.target as HTMLInputElement).files?.[0]
                if (file) {
                  formData.append('image', file)
                  const { data } = await privateApi.post('/images', formData)
                  editor.chain().focus().setImage({ src: data.data }).run()
                }


              } catch (error) {
                const errorMessage = handleAxiosError(error)
                toast.dismiss()
                toast.error(errorMessage)
              }
            }
            input.click()
          }}
        >
          <ImageIcon className='w-4 h-4 md:w-6 md:h-6' />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export default Tiptap
