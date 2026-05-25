import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'outline', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Add to Collection' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancel' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Browse Catalog' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Remove', size: 'sm' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete' },
};

export const Loading: Story = {
  args: { variant: 'primary', children: 'Saving...', loading: true },
};

export const Disabled: Story = {
  args: { variant: 'primary', children: 'Submit', disabled: true },
};

export const Small: Story = {
  args: { variant: 'outline', children: 'View', size: 'sm' },
};

export const Large: Story = {
  args: { variant: 'primary', children: 'Sign In', size: 'lg' },
};
