#include <iostream>
#include <algorithm>

using namespace std;

string decToBin(int n) {
    string bin;

    while (n != 0) {
        bin = to_string(n & 1).append(bin);
        n >>= 1;
    }

    return bin;
}

int solution(int N) {
    int maxCount{0};
    int count{0};

    while (!(N & 1)) {
        N >>= 1;
    }

    while (N != 0) {
        auto lsb = N & 1;

        if (lsb == 1) {
            maxCount = max(count, maxCount);
            count = 0;
        } else {
            count++;
        }

        N >>= 1;
    }

    return maxCount;
}

int main() {
    int num = 529;
    cout << decToBin(num) << endl;
    cout << solution(num) << endl;
}