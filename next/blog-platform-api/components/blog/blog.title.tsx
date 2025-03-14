import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const BlogFormTitleSubtitle = ({
    title,
    setTitle,
    subtitle,
    setSubtitle,
}: {
    title: string;
    setTitle: (title: string) => void;
    subtitle: string;
    setSubtitle: (subtitle: string) => void;
}) => {
    return (
        <>
            <div className="flex flex-col gap-2 text-xl">
                <Label className="font-semibold">Title</Label>
                <Input
                    id='title'
                    name='title'
                    type='text'
                    placeholder='The Importance of Clean Code in Software Development'
                    required
                    minLength={5}
                    onChange={(e) => setTitle(e.target.value)}
                    defaultValue={title}
                    className="textarea textarea-bordered p-2"
                />
                <Label className="font-semibold">Subtitle</Label>
                <Textarea
                    id='subtitle'
                    name='subtitle'
                    placeholder='How Writing Readable and Maintainable Code Leads to Long-Term Success'
                    required
                    minLength={5}
                    onChange={(e) => setSubtitle(e.target.value)}
                    defaultValue={subtitle}
                    className="textarea textarea-bordered p-2"
                />
            </div>
        </>
    );
}

export default BlogFormTitleSubtitle;