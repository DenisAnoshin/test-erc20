const PORT = process.env.PORT || 3001;

export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "ERC20 Token API",
    version: "1.0.0",
    description: "REST API for interacting with ERC20 smart contracts using Viem"
  },
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: "Local development server"
    }
  ],
  paths: {
    "/health": {
      get: {
        summary: "Health check endpoint",
        description: "Check if the API server is running",
        responses: {
          "200": {
            description: "Server is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    ok: { 
                      type: "boolean",
                      example: true,
                      description: "Health status"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/mint": {
      post: {
        summary: "Mint tokens to address",
        description: "Mint new tokens to a specified address (requires PRIVATE_KEY of contract owner)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  to: { 
                    type: "string",
                    pattern: "^0x[a-fA-F0-9]{40}$",
                    description: "Recipient address",
                    example: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
                  },
                  amount: { 
                    type: "string",
                    description: "Amount to mint (will be parsed with token decimals)",
                    example: "42.0"
                  }
                },
                required: ["to", "amount"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Mint successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    hash: { 
                      type: "string",
                      description: "Transaction hash",
                      example: "0x1234567890abcdef..."
                    },
                    status: { 
                      type: "number",
                      description: "Transaction status (1 = success, 0 = failure)",
                      example: 1
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Bad request or mint failed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/token": {
      get: {
        summary: "Get token information",
        description: "Retrieve basic information about the deployed ERC20 token",
        responses: {
          "200": {
            description: "Token information retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    address: { 
                      type: "string",
                      description: "Contract address",
                      example: "0x73511669fd4dE447feD18BB79bAFeAC93aB7F31f"
                    },
                    name: { 
                      type: "string",
                      description: "Token name",
                      example: "MyToken"
                    },
                    symbol: { 
                      type: "string",
                      description: "Token symbol",
                      example: "MTK"
                    },
                    decimals: { 
                      type: "number",
                      description: "Token decimals",
                      example: 18
                    },
                    totalSupply: { 
                      type: "string",
                      description: "Total supply in wei",
                      example: "1000000000000000000000000"
                    },
                    totalSupplyFormatted: { 
                      type: "string",
                      description: "Total supply formatted with decimals",
                      example: "1000000.0"
                    }
                  }
                }
              }
            }
          },
          "500": {
            description: "Internal server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/balance/{address}": {
      get: {
        summary: "Get token balance for address",
        description: "Retrieve the token balance for a specific Ethereum address",
        parameters: [
          {
            name: "address",
            in: "path",
            required: true,
            schema: { 
              type: "string",
              pattern: "^0x[a-fA-F0-9]{40}$"
            },
            description: "Ethereum address to check balance for",
            example: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
          }
        ],
        responses: {
          "200": {
            description: "Balance retrieved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    address: { 
                      type: "string",
                      description: "Address that was checked",
                      example: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
                    },
                    balance: { 
                      type: "string",
                      description: "Balance in wei",
                      example: "1000000000000000000000"
                    },
                    balanceFormatted: { 
                      type: "string",
                      description: "Balance formatted with decimals",
                      example: "1000.0"
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Bad request - invalid address",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/transfer": {
      post: {
        summary: "Transfer tokens from server wallet",
        description: "Transfer tokens from the server's wallet to another address (requires PRIVATE_KEY)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  to: { 
                    type: "string",
                    pattern: "^0x[a-fA-F0-9]{40}$",
                    description: "Recipient address",
                    example: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
                  },
                  amount: { 
                    type: "string",
                    description: "Amount to transfer (will be parsed with token decimals)",
                    example: "100.5"
                  }
                },
                required: ["to", "amount"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Transfer successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    hash: { 
                      type: "string",
                      description: "Transaction hash",
                      example: "0x1234567890abcdef..."
                    },
                    status: { 
                      type: "number",
                      description: "Transaction status (1 = success, 0 = failure)",
                      example: 1
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Bad request or transfer failed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/transferFrom": {
      post: {
        summary: "Transfer tokens using allowance",
        description: "Transfer tokens from one address to another using the server's allowance (requires PRIVATE_KEY)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  from: { 
                    type: "string",
                    pattern: "^0x[a-fA-F0-9]{40}$",
                    description: "Address to transfer from (must have approved server)",
                    example: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
                  },
                  to: { 
                    type: "string",
                    pattern: "^0x[a-fA-F0-9]{40}$",
                    description: "Recipient address",
                    example: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0"
                  },
                  amount: { 
                    type: "string",
                    description: "Amount to transfer (will be parsed with token decimals)",
                    example: "50.25"
                  }
                },
                required: ["from", "to", "amount"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Transfer successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    hash: { 
                      type: "string",
                      description: "Transaction hash",
                      example: "0x1234567890abcdef..."
                    },
                    status: { 
                      type: "number",
                      description: "Transaction status (1 = success, 0 = failure)",
                      example: 1
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Bad request, insufficient allowance, or transfer failed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/approve": {
      post: {
        summary: "Approve spender for server wallet",
        description: "Approve another address to spend tokens from the server's wallet (requires PRIVATE_KEY)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  spender: { 
                    type: "string",
                    pattern: "^0x[a-fA-F0-9]{40}$",
                    description: "Address to approve for spending",
                    example: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199"
                  },
                  amount: { 
                    type: "string",
                    description: "Amount to approve (will be parsed with token decimals)",
                    example: "1000.0"
                  }
                },
                required: ["spender", "amount"]
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Approve successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    hash: { 
                      type: "string",
                      description: "Transaction hash",
                      example: "0x1234567890abcdef..."
                    },
                    status: { 
                      type: "number",
                      description: "Transaction status (1 = success, 0 = failure)",
                      example: 1
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Bad request or approve failed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Error message"
          }
        }
      }
    }
  }
};

export default swaggerSpec;
