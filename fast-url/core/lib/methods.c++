#include "./utils/socket.hpp"
#include <unistd.h>
#include <thread>

char* get_response(){
    return {};
}

char* parse_response(){
    return {};
}

int main(){
    Socket socket;
    if (socket.Connect("127.0.0.1", 80)) {
        std::cout << "Connected successfully!" << std::endl;
        const char* request = "GET / HTTP/1.1\r\nHost: 127.0.0.1\r\nConnection: close\r\n\r\n";
        if (socket.Send(request, strlen(request))) {
            std::cout << "Request sent successfully!" << std::endl;
            char response[4096];
            int bytes_received;
            while ((bytes_received = socket.Receive(response, sizeof(response))) > 0) {
                std::cout.write(response, bytes_received);
            }
        } else {
            std::cerr << "Failed to send request." << std::endl;
        }
    } else {
        std::cerr << "Connection failed." << std::endl;
    }
    return 0;
}