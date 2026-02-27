import ChildrenController from '@/actions/App/Http/Controllers/Settings/ChildrenController';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Form, Head, usePage } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { index } from '@/routes/children';
import { Spinner } from '@/components/ui/spinner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Children',
        href: index().url,
    },
];

interface Child {
    id: number;
    name: string;
}

interface PageProps extends SharedData {
    children: Child[]
}

export default function Children() {
    const { children } = usePage<PageProps>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Children" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Children information"
                        description="Manage your children here"
                    />

                    {/* Add Child Form */}
                    <div className="space-y-4">
                        <Form
                            {...ChildrenController.add.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            resetOnSuccess
                        >
                            {({ errors, processing }) => (
                                <>
                                    <Label htmlFor="name">
                                        Add a new child
                                    </Label>
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            name="name"
                                            placeholder="Child name"
                                            required
                                            className="flex-1"
                                        />

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing && <Spinner />}
                                            Add
                                        </Button>
                                    </div>
                                    <InputError
                                        message={errors.name}
                                    />
                                </>
                            )}
                        </Form>
                    </div>

                    {/* Children List */}
                    <div className="space-y-4">
                        {children.length === 0 ? (
                            <p>No children added yet.</p>
                        ) : (
                            children.map((child: any) => (
                                <div key={child.id} className="flex gap-2 items-start">
                                    <Form
                                        {...ChildrenController.update.form()}
                                        className='flex-1'
                                    >
                                        {({ errors, processing }) => (
                                            <>
                                                <div className="flex gap-2 items-center flex-1">
                                                    <input type="hidden" name="child_id" value={child.id} />
                                                    <Input
                                                        name="name"
                                                        defaultValue={child.name}
                                                        required
                                                        className="flex-1"
                                                    />
                                                    <Button type="submit" disabled={processing}>
                                                        {processing && <Spinner />}
                                                        Update
                                                    </Button>
                                                </div>
                                                <InputError
                                                    message={errors.name}
                                                />
                                            </>
                                        )}
                                    </Form>
                                    <Form
                                        {...ChildrenController.remove.form()}
                                        className="inline"
                                    >
                                        {({ processing }) => (
                                            <>
                                                <input type="hidden" name="child_id" value={child.id} />
                                                <Button
                                                    type="submit"
                                                    variant="destructive"
                                                    disabled={processing}
                                                    className="ml-2"
                                                >
                                                    {processing && <Spinner />}
                                                    Remove
                                                </Button>
                                            </>
                                        )}
                                    </Form>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
