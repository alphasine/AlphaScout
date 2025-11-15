# AlphaScout Codebase Analysis

This document provides a comprehensive overview of the AlphaScout application's architecture, data flow, and key components.

## 1. Project Overview

AlphaScout is an open-source AI web automation Chrome extension that utilizes a multi-agent system to perform tasks in the browser. The project is structured as a monorepo, using pnpm workspaces and Turborepo to manage its various packages and dependencies.

**Key Technologies:**

- **TypeScript:** For type-safe JavaScript development.
- **React:** For building the user interface.
- **Vite:** As the build tool for the frontend applications.
- **Puppeteer:** For browser automation and interaction.
- **LangChain.js:** For integrating with large language models (LLMs).

## 2. Architecture

The AlphaScout application is divided into three main parts: the core extension, shared packages, and UI pages.

### 2.1. Monorepo Structure

- **`chrome-extension/`:** This directory contains the core logic of the Chrome extension, including the background scripts, manifest file, and the multi-agent system.
- **`packages/`:** This directory houses a collection of shared libraries that are used across the application. This includes UI components, storage utilities, development tools, and more.
- **`pages/`:** This directory contains the various UI applications that make up the extension's user interface, such as the side panel and the options page.

### 2.2. Multi-Agent System

The heart of AlphaScout's functionality lies in its multi-agent system, which is composed of three main agents:

- **`Executor`:** This is the central orchestrator that manages the entire task execution flow. It receives tasks from the UI, coordinates the other agents, and sends updates back to the UI.
- **`PlannerAgent`:** This agent is responsible for breaking down high-level user requests into smaller, more manageable steps that the other agents can execute.
- **`NavigatorAgent`:** This agent is responsible for interacting with the browser. It uses Puppeteer to perform actions on web pages, such as clicking buttons, filling out forms, and navigating to new pages.

The code for the multi-agent system can be found in `chrome-extension/src/background/agent/`.

### 2.3. Browser Automation

Browser automation is handled by a combination of the `BrowserContext` and `Page` classes:

- **`BrowserContext`:** This class manages the overall browser state, including all open tabs and pages. It provides a centralized way to interact with the browser as a whole.
- **`Page`:** This class represents a single browser page and provides an abstraction layer over Puppeteer. It exposes methods for performing actions on the page, such as clicking elements, typing text, and taking screenshots.

The browser automation logic is located in `chrome-extension/src/background/browser/`.

### 2.4. UI Components

The user interface is built with React and TypeScript. The main UI is the side panel, which is located in `pages/side-panel/`. The side panel communicates with the background script using `chrome.runtime.connect` to send tasks and receive updates. Reusable UI components that are shared across different parts of the extension can be found in `packages/ui/`.

### 2.5. Storage

The extension's data is persisted using a custom storage module built on top of Chrome's storage API. The core storage logic is located in `packages/storage/lib/base/base.ts`, which provides a generic `createStorage` function for creating storage areas. Chat history is stored in a structured way using the `createChatHistoryStorage` function in `packages/storage/lib/chat/history.ts`.

## 3. Data Flow

1. The user initiates a task through the side panel UI.
2. The side panel sends a message containing the task details to the background script.
3. The `Executor` in the background script receives the task and begins the execution loop.
4. The `PlannerAgent` is invoked to break the task down into a series of steps.
5. The `NavigatorAgent` executes each step by interacting with the browser through the `BrowserContext` and `Page` classes.
6. The agents report their progress and results back to the `Executor`.
7. The `Executor` sends events to the side panel to update the UI with the current status of the task.
8. Throughout this process, chat history and other relevant data are saved to Chrome's storage via the storage module.

## 4. Key Components

- **`chrome-extension/src/background/agent/executor.ts`:** The central orchestrator of the multi-agent system.
- **`chrome-extension/src/background/agent/agents/navigator.ts`:** The agent responsible for browser interaction.
- **`chrome-extension/src/background/agent/agents/planner.ts`:** The agent responsible for task planning.
- **`chrome-extension/src/background/browser/context.ts`:** Manages the browser context, including tabs and pages.
- **`chrome-extension/src/background/browser/page.ts`:** Provides an abstraction layer over Puppeteer for interacting with web pages.
- **`pages/side-panel/src/SidePanel.tsx`:** The main React component for the side panel UI.
- **`packages/storage/lib/base/base.ts`:** The core storage implementation.
- **`packages/storage/lib/chat/history.ts`:** The implementation for storing chat history.
