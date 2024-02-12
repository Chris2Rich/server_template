#include <iostream>
#include <cstring>
#include <cstdlib>

#ifdef _WIN32
    #include <winsock2.h>
    #include <ws2tcpip.h>
    #pragma comment(lib, "Ws2_32.lib")
#else
    #include <unistd.h>
    #include <sys/socket.h>
    #include <netinet/in.h>
    #include <arpa/inet.h>
    #define SOCKET int
    #define INVALID_SOCKET -1
#endif

class Socket {
private:
    SOCKET sockfd;
public:
    Socket() : sockfd(INVALID_SOCKET) {
        #ifdef _WIN32
            WSADATA wsaData;
            if (WSAStartup(MAKEWORD(2, 2), &wsaData) != 0) {
                std::cerr << "WSAStartup failed." << std::endl;
            }
        #endif
    }

    ~Socket() { Close(); }

    bool Connect(const char* host, int port) {
        if (!host) {
            std::cerr << "Invalid host." << std::endl;
            return false;
        }

        if (port <= 0 || port > 65535) {
            std::cerr << "Invalid port number." << std::endl;
            return false;
        }

        struct sockaddr_in server_addr;
        sockfd = socket(AF_INET, SOCK_STREAM, 0);
        if (sockfd == INVALID_SOCKET) {
            std::cerr << "Failed to create socket." << std::endl;
            return false;
        }

        server_addr.sin_family = AF_INET;
        server_addr.sin_port = htons(port);
        if (inet_pton(AF_INET, host, &server_addr.sin_addr) <= 0) {
            std::cerr << "Invalid address/ Address not supported." << std::endl;
            Close();
            return false;
        }

        if (connect(sockfd, (struct sockaddr *)&server_addr, sizeof(server_addr)) < 0) {
            std::cerr << "Connection failed." << std::endl;
            Close();
            return false;
        }

        return true;
    }

    bool Send(const char* data, int length) {
        if (sockfd == INVALID_SOCKET) {
            std::cerr << "Socket not initialized." << std::endl;
            return false;
        }

        if (!data || length <= 0) {
            std::cerr << "Invalid data to send." << std::endl;
            return false;
        }

        int sent = send(sockfd, data, length, 0);
        if (sent != length) {
            std::cerr << "Failed to send data." << std::endl;
            return false;
        }

        return true;
    }

    int Receive(char* buffer, int length) {
        if (sockfd == INVALID_SOCKET) {
            std::cerr << "Socket not initialized." << std::endl;
            return -1;
        }

        if (!buffer || length <= 0) {
            std::cerr << "Invalid buffer for receive." << std::endl;
            return -1;
        }

        int received = recv(sockfd, buffer, length, 0);
        if (received < 0) {
            std::cerr << "Receive failed." << std::endl;
        }

        return received;
    }

    void Close() {
        if (sockfd != INVALID_SOCKET) {
            #ifdef _WIN32
                closesocket(sockfd);
                WSACleanup();
            #else
                close(sockfd);
            #endif
            sockfd = INVALID_SOCKET;
        }
    }
};