import type { Meta, StoryObj } from '@storybook/react';
import LoadingSpinner from './LoadingSpinner';

const meta: Meta<typeof LoadingSpinner> = {
  title: 'UI/LoadingSpinner',
  component: LoadingSpinner,
  tags: ['autodocs'],
  argTypes: {
    message: { control: 'text' },
    fullPage: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingSpinner>;

export const Default: Story = {
  args: { message: 'Loading...' },
};

export const WithCustomMessage: Story = {
  args: { message: 'Fetching game data...' },
};

export const FullPage: Story = {
  args: { message: 'Loading dashboard...', fullPage: true },
};
