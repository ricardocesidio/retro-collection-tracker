import type { Meta, StoryObj } from '@storybook/react';
import Alert from './Alert';

const meta: Meta<typeof Alert> = {
  title: 'UI/Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['danger', 'success', 'warning', 'info'] },
  },
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Danger: Story = {
  args: { variant: 'danger', children: 'Failed to add game. Please try again.' },
};

export const Success: Story = {
  args: { variant: 'success', children: 'Game added to collection successfully!' },
};

export const Warning: Story = {
  args: { variant: 'warning', children: 'Your session is about to expire.' },
};

export const Info: Story = {
  args: { variant: 'info', children: 'New features are available. Refresh to update.' },
};
