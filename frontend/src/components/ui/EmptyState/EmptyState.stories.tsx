import type { Meta, StoryObj } from '@storybook/react';
import EmptyState from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'text' },
    title: { control: 'text' },
    message: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    icon: '🎮',
    title: 'No games yet',
    message: 'Start building your retro collection.',
  },
};

export const Wishlist: Story = {
  args: {
    icon: '⭐',
    title: 'Your wishlist is empty',
    message: 'Explore the catalog and save games for later.',
  },
};

export const Messages: Story = {
  args: {
    icon: '💬',
    title: 'No conversations',
    message: 'Select a conversation to start chatting.',
  },
};

export const Reviews: Story = {
  args: {
    icon: '📝',
    title: 'No reviews yet',
    message: 'Write your first review.',
  },
};
