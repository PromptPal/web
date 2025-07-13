# PromptPal [![codecov](https://codecov.io/gh/PromptPal/web/graph/badge.svg?token=H8DVMAYJ9V)](https://codecov.io/gh/PromptPal/web)

> **Warning**
> This project is currently in an early stage of development and may not be suitable for production use. Use with caution and expect frequent updates and changes.

PromptPal is an exceptional prompts management tool designed specifically for startups and individual contributors in the field of AI. It serves as a centralized platform to effortlessly manage prompts within your AI projects, enabling seamless collaboration and workflow optimization. With PromptPal, you can ensure efficient prompt tracking, simplify project management, and never miss a critical prompt.

# Features
- **On-Premise and Cloud-Native**: PromptPal excels in both on-premise and cloud-native environments, making it a versatile solution for AI projects. Its lightweight architecture guarantees efficient resource utilization, ensuring optimal performance.

- **Effortless Setup**: Experience the ease of setup with PromptPal. A simple one-line Docker run command sets up the entire application, ensuring a swift and hassle-free onboarding process.

- **SQLite Support**: PromptPal seamlessly integrates with SQLite, a robust and scalable database solution. This ensures seamless prompt management, offering reliability and efficiency.

- **SDK Support**: Enjoy the convenience of SDK support with PromptPal. Whether you choose Golang or Node.js, our well-crafted SDKs simplify the integration process, making it effortless to incorporate PromptPal's capabilities into your AI applications.

- **Prompt Tracking**: Effortlessly create, organize, and manage prompts within your AI projects. PromptPal empowers you with a comprehensive overview of all prompts and their respective progress, keeping you informed and in control.

- **Collaboration**: Foster effective collaboration with team members using PromptPal's integrated collaboration features. Engage in meaningful discussions, seek clarifications, and seamlessly share updates, ensuring everyone is aligned and working towards the same goal.

- **Prompt Analytics (Work in Progress)**: Unlock valuable insights into your prompt management process with PromptPal's forthcoming analytics features. Leverage powerful metrics, analyze trends, and optimize your AI workflow for unparalleled productivity.

- **Prompt Version Backup and Diff (Work in Progress)**: Ensure complete prompt version control with PromptPal's upcoming version backup and diff capabilities. Effortlessly track prompt changes, review revisions, and easily identify differences between versions.

# Getting Started
These instructions will guide you through the process of setting up PromptPal on your local machine for development and testing purposes.

## Prerequisites
- Web3 Fundamental: Familiarity with the fundamentals of Web3 is essential, especially for account management with PromptPal. This includes knowledge of Ethereum, Metamask, and interacting with blockchain-based accounts.

- OpenAI Prompts: Understand the basics of OpenAI prompts and how they are used in AI projects. Familiarize yourself with the Prompt API provided by OpenAI to fully leverage PromptPal's capabilities.

- Docker: Docker is required to run the PromptPal image and set up the application effortlessly. Make sure you have Docker installed and configured on your machine.

- Kubernetes(Optional): For advanced deployment scenarios, familiarity with Kubernetes can be beneficial. Kubernetes allows for more sophisticated and scalable deployments of PromptPal.

- Value of Life (No Late Nights): We encourage you to prioritize work-life balance and cherish the value of life. With PromptPal, you can efficiently manage your prompts, enabling you to complete your tasks and enjoy your well-deserved time off. Remember, it's okay to choose PromptPal to help you get off early and have more time for yourself!

## Installation
- Setup Metamask Wallet: Set up a Metamask wallet and copy the public address associated with it.

- Run Docker Image: Use Docker to run the PromptPal image. Execute the following command, replacing {PUBLIC_ADDRESS} with your Metamask wallet's public address:

```bash
docker run -e ADMIN_LIST={PUBLIC_ADDRESS} -p 7788:7788 annatarhe/prompt-pal:master
```

- Access PromptPal: Open your preferred web browser and visit http://localhost:7788.

- Login via Metamask: Log in to PromptPal using Metamask. This ensures secure authentication and access to your account.

## Usage
Once the setup is complete, you can proceed with regular usage:

- Create a New Project: Create a new project within PromptPal to organize your prompts.

- Create Prompts: Add prompts to your project, including any relevant variables required for your AI application.

- Generate Project API Token: Via the PromptPal portal, create a project API token and copy the secret associated with it. This token will be used for CLI integration.

- Download and Configure PromptPal CLI: Download the PromptPal CLI from GitHub and run the `prompt-pal init` command. Update the configuration file `promptpal.yaml` with your project name and the secret obtained in the previous step.

- Generate Type Definitions: Run the CLI command `prompt-pal g` to generate type definitions in either Golang or TypeScript, depending on your preferred language.

- Install SDK and Integrate: Install the PromptPal SDK for your chosen language and proceed with integrating it into your AI application. Use the provided type definitions and SDK functionalities to seamlessly interact with PromptPal.

# Contributing
We warmly welcome contributions from the community to enhance PromptPal. To contribute, please follow these steps:

- Fork the repository.

- Create a new branch: git checkout -b my-new-feature

- Implement your changes and commit them: git commit -am 'Add some feature'

- Push the branch: git push origin my-new-feature

- Submit a pull request.

# Contact
If you have any questions, suggestions, or issues, please don't hesitate to reach out to us at annatar.he@gmail.com.

