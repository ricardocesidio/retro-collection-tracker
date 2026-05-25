import type { Meta, StoryObj } from '@storybook/react';
import Input from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    hint: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    type: { control: 'select', options: ['text', 'email', 'password'] },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: 'Search games...' },
};

export const WithLabel: Story = {
  args: { label: 'Email', placeholder: 'you@example.com', type: 'email' },
};

export const WithError: Story = {
  args: { label: 'Password', type: 'password', error: 'Password must be at least 8 characters' },
};

export const WithHint: Story = {
  args: { label: 'Username', placeholder: 'retro_collector', hint: 'Must be at least 3 characters' },
};

export const Required: Story = {
  args: { label: 'Email', placeholder: 'you@example.com', required: true },
};

export const Disabled: Story = {
  args: { label: 'Username', value: 'retro_alice', disabled: true },
};
