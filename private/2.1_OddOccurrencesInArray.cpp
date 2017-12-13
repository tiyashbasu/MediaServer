#include <iostream>
#include <vector>

using namespace std;

int solution(vector<int>& A) {
    int oddFilter = 0;

    for (const auto& item : A) {
        oddFilter ^= item;
    }

    return oddFilter;
}

int main() {
    vector<int> vec{9, 3, 9, 3, 9, 7, 9};
    cout << solution(vec) << endl;
}