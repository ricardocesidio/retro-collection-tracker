import type { Meta, StoryObj } from '@storybook/react';
import Badge from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['highlight', 'success', 'warning', 'danger', 'info', 'default', 'cyan'] },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Highlight: Story = {
  args: { variant: 'highlight', children: 'Priority 1' },
};

export const Success: Story = {
  args: { variant: 'success', children: 'Completed' },
};

export const Warning: Story = {
  args: { variant: 'warning', children: 'Pending' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: 'Cancelled' },
};

export const Info: Story = {
  args: { variant: 'info', children: 'In Progress' },
};

export const Cyan: Story = {
  args: { variant: 'cyan', children: 'MINT' },
};

export const Default: Story = {
  args: { variant: 'default', children: 'OWNED' },
};
