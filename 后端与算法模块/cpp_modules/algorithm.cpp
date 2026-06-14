#include <algorithm>
#include <cctype>
#include <cmath>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <map>
#include <set>
#include <sstream>
#include <stdexcept>
#include <string>
#include <vector>

using namespace std;

// =============================================================
// Tongpin Study - C++ algorithm module
// Modes:
//   algorithm.exe match   input.json result.json
//   algorithm.exe score   input.json result.json
//   algorithm.exe ranking input.json result.json
//   algorithm.exe validate input.json result.json
//
// Notes:
// 1. This program does not connect to SQLite or Streamlit.
// 2. Python should query SQLite, write input.json, call this exe,
//    then read result.json.
// 3. Source code uses ASCII messages to avoid Visual Studio encoding issues.
// =============================================================

class Json {
public:
    enum Type { NUL, BOOL, NUMBER, STRING, ARRAY, OBJECT };

    Type type;
    bool b;
    double num;
    string str;
    vector<Json> arr;
    map<string, Json> obj;

    Json() : type(NUL), b(false), num(0) {}
    Json(nullptr_t) : type(NUL), b(false), num(0) {}
    Json(bool v) : type(BOOL), b(v), num(0) {}
    Json(int v) : type(NUMBER), b(false), num(v) {}
    Json(double v) : type(NUMBER), b(false), num(v) {}
    Json(const string& v) : type(STRING), b(false), num(0), str(v) {}
    Json(const char* v) : type(STRING), b(false), num(0), str(v) {}

    static Json array() {
        Json j;
        j.type = ARRAY;
        return j;
    }

    static Json object() {
        Json j;
        j.type = OBJECT;
        return j;
    }

    bool isNull() const { return type == NUL; }
    bool isBool() const { return type == BOOL; }
    bool isNumber() const { return type == NUMBER; }
    bool isString() const { return type == STRING; }
    bool isArray() const { return type == ARRAY; }
    bool isObject() const { return type == OBJECT; }

    bool has(const string& key) const {
        return type == OBJECT && obj.find(key) != obj.end();
    }

    const Json& at(const string& key) const {
        static Json nullJson;
        if (type != OBJECT) return nullJson;
        auto it = obj.find(key);
        if (it == obj.end()) return nullJson;
        return it->second;
    }

    Json& operator[](const string& key) {
        if (type != OBJECT) {
            type = OBJECT;
            obj.clear();
        }
        return obj[key];
    }

    void push_back(const Json& value) {
        if (type != ARRAY) {
            type = ARRAY;
            arr.clear();
        }
        arr.push_back(value);
    }
};

class JsonParser {
private:
    string s;
    size_t pos;

    void skipWs() {
        while (pos < s.size() && isspace((unsigned char)s[pos])) pos++;
    }

    char peek() {
        skipWs();
        if (pos >= s.size()) return '\0';
        return s[pos];
    }

    char get() {
        if (pos >= s.size()) return '\0';
        return s[pos++];
    }

    void expect(char c) {
        skipWs();
        if (pos >= s.size() || s[pos] != c) {
            string msg = "JSON parse error: expected '";
            msg.push_back(c);
            msg += "'";
            throw runtime_error(msg);
        }
        pos++;
    }

    Json parseNull() {
        if (s.substr(pos, 4) != "null") throw runtime_error("JSON parse error: invalid null");
        pos += 4;
        return Json(nullptr);
    }

    Json parseBool() {
        if (s.substr(pos, 4) == "true") {
            pos += 4;
            return Json(true);
        }
        if (s.substr(pos, 5) == "false") {
            pos += 5;
            return Json(false);
        }
        throw runtime_error("JSON parse error: invalid bool");
    }

    Json parseNumber() {
        skipWs();
        size_t start = pos;
        if (pos < s.size() && s[pos] == '-') pos++;
        while (pos < s.size() && isdigit((unsigned char)s[pos])) pos++;
        if (pos < s.size() && s[pos] == '.') {
            pos++;
            while (pos < s.size() && isdigit((unsigned char)s[pos])) pos++;
        }
        if (pos < s.size() && (s[pos] == 'e' || s[pos] == 'E')) {
            pos++;
            if (pos < s.size() && (s[pos] == '+' || s[pos] == '-')) pos++;
            while (pos < s.size() && isdigit((unsigned char)s[pos])) pos++;
        }
        double value = stod(s.substr(start, pos - start));
        return Json(value);
    }

    string parseRawString() {
        expect('"');
        string out;
        while (pos < s.size()) {
            char c = get();
            if (c == '"') break;
            if (c == '\\') {
                if (pos >= s.size()) throw runtime_error("JSON parse error: invalid escape");
                char e = get();
                switch (e) {
                    case '"': out.push_back('"'); break;
                    case '\\': out.push_back('\\'); break;
                    case '/': out.push_back('/'); break;
                    case 'b': out.push_back('\b'); break;
                    case 'f': out.push_back('\f'); break;
                    case 'n': out.push_back('\n'); break;
                    case 'r': out.push_back('\r'); break;
                    case 't': out.push_back('\t'); break;
                    case 'u': {
                        // Keep unicode escape as plain marker. Input samples use UTF-8 directly.
                        if (pos + 4 <= s.size()) {
                            out += "\\u" + s.substr(pos, 4);
                            pos += 4;
                        } else {
                            throw runtime_error("JSON parse error: invalid unicode escape");
                        }
                        break;
                    }
                    default: out.push_back(e); break;
                }
            } else {
                out.push_back(c);
            }
        }
        return out;
    }

    Json parseString() {
        return Json(parseRawString());
    }

    Json parseArray() {
        Json result = Json::array();
        expect('[');
        skipWs();
        if (peek() == ']') {
            get();
            return result;
        }
        while (true) {
            result.push_back(parseValue());
            skipWs();
            char c = get();
            if (c == ']') break;
            if (c != ',') throw runtime_error("JSON parse error: expected comma in array");
        }
        return result;
    }

    Json parseObject() {
        Json result = Json::object();
        expect('{');
        skipWs();
        if (peek() == '}') {
            get();
            return result;
        }
        while (true) {
            skipWs();
            if (peek() != '"') throw runtime_error("JSON parse error: object key must be string");
            string key = parseRawString();
            expect(':');
            result[key] = parseValue();
            skipWs();
            char c = get();
            if (c == '}') break;
            if (c != ',') throw runtime_error("JSON parse error: expected comma in object");
        }
        return result;
    }

public:
    JsonParser(const string& text) : s(text), pos(0) {}

    Json parseValue() {
        skipWs();
        char c = peek();
        if (c == '{') return parseObject();
        if (c == '[') return parseArray();
        if (c == '"') return parseString();
        if (c == 't' || c == 'f') return parseBool();
        if (c == 'n') return parseNull();
        if (c == '-' || isdigit((unsigned char)c)) return parseNumber();
        throw runtime_error("JSON parse error: invalid value");
    }

    Json parse() {
        Json v = parseValue();
        skipWs();
        if (pos != s.size()) throw runtime_error("JSON parse error: trailing characters");
        return v;
    }
};

string readFile(const string& path) {
    ifstream fin(path, ios::binary);
    if (!fin.is_open()) throw runtime_error("cannot open input file: " + path);
    stringstream ss;
    ss << fin.rdbuf();
    return ss.str();
}

void writeFile(const string& path, const string& text) {
    ofstream fout(path, ios::binary);
    if (!fout.is_open()) throw runtime_error("cannot open output file: " + path);
    fout << text;
}

string escapeJsonString(const string& s) {
    string out;
    for (char c : s) {
        switch (c) {
            case '"': out += "\\\""; break;
            case '\\': out += "\\\\"; break;
            case '\b': out += "\\b"; break;
            case '\f': out += "\\f"; break;
            case '\n': out += "\\n"; break;
            case '\r': out += "\\r"; break;
            case '\t': out += "\\t"; break;
            default:
                if ((unsigned char)c < 0x20) {
                    stringstream ss;
                    ss << "\\u" << hex << setw(4) << setfill('0') << (int)(unsigned char)c;
                    out += ss.str();
                } else {
                    out.push_back(c);
                }
        }
    }
    return out;
}

string jsonDump(const Json& j, int indent = 0) {
    string pad(indent, ' ');
    string pad2(indent + 2, ' ');
    stringstream ss;

    switch (j.type) {
        case Json::NUL:
            ss << "null";
            break;
        case Json::BOOL:
            ss << (j.b ? "true" : "false");
            break;
        case Json::NUMBER: {
            if (fabs(j.num - round(j.num)) < 1e-9) {
                ss << fixed << setprecision(0) << j.num;
            } else {
                ss << fixed << setprecision(2) << j.num;
            }
            break;
        }
        case Json::STRING:
            ss << "\"" << escapeJsonString(j.str) << "\"";
            break;
        case Json::ARRAY:
            ss << "[";
            if (!j.arr.empty()) ss << "\n";
            for (size_t i = 0; i < j.arr.size(); ++i) {
                ss << pad2 << jsonDump(j.arr[i], indent + 2);
                if (i + 1 < j.arr.size()) ss << ",";
                ss << "\n";
            }
            if (!j.arr.empty()) ss << pad;
            ss << "]";
            break;
        case Json::OBJECT:
            ss << "{";
            if (!j.obj.empty()) ss << "\n";
            size_t count = 0;
            for (const auto& kv : j.obj) {
                ss << pad2 << "\"" << escapeJsonString(kv.first) << "\": " << jsonDump(kv.second, indent + 2);
                if (++count < j.obj.size()) ss << ",";
                ss << "\n";
            }
            if (!j.obj.empty()) ss << pad;
            ss << "}";
            break;
    }
    return ss.str();
}

string getString(const Json& obj, const string& key, const string& def = "") {
    const Json& v = obj.at(key);
    if (v.isString()) return v.str;
    return def;
}

int getInt(const Json& obj, const string& key, int def = 0) {
    const Json& v = obj.at(key);
    if (v.isNumber()) return (int)round(v.num);
    return def;
}

double getDouble(const Json& obj, const string& key, double def = 0.0) {
    const Json& v = obj.at(key);
    if (v.isNumber()) return v.num;
    return def;
}

bool getBool(const Json& obj, const string& key, bool def = false) {
    const Json& v = obj.at(key);
    if (v.isBool()) return v.b;
    return def;
}

vector<string> getStringArray(const Json& obj, const string& key) {
    vector<string> result;
    const Json& v = obj.at(key);
    if (!v.isArray()) return result;
    for (const Json& item : v.arr) {
        if (item.isString()) result.push_back(item.str);
    }
    return result;
}

vector<int> getIntArray(const Json& obj, const string& key) {
    vector<int> result;
    const Json& v = obj.at(key);
    if (!v.isArray()) return result;
    for (const Json& item : v.arr) {
        if (item.isNumber()) result.push_back((int)round(item.num));
    }
    return result;
}

Json successResult(const string& mode, const Json& data) {
    Json out = Json::object();
    out["success"] = Json(true);
    out["mode"] = Json(mode);
    out["data"] = data;
    return out;
}

Json errorResult(const string& mode, const string& message) {
    Json out = Json::object();
    out["success"] = Json(false);
    out["mode"] = Json(mode);
    out["message"] = Json(message);
    return out;
}

bool containsInt(const vector<int>& values, int x) {
    return find(values.begin(), values.end(), x) != values.end();
}

int countCommonTags(const vector<string>& a, const vector<string>& b, vector<string>* common = nullptr) {
    set<string> setA(a.begin(), a.end());
    set<string> seen;
    int count = 0;
    for (const string& tag : b) {
        if (setA.count(tag) && !seen.count(tag)) {
            count++;
            seen.insert(tag);
            if (common) common->push_back(tag);
        }
    }
    return count;
}

Json handleMatch(const Json& input) {
    vector<string> userTags = getStringArray(input, "user_tags");
    vector<int> joinedGroupIds = getIntArray(input, "joined_group_ids");
    int topN = getInt(input, "top_n", 10);

    struct Row {
        int groupId;
        string groupName;
        double matchScore;
        double tagScore;
        double activeScore;
        double memberScore;
        string reason;
    };

    vector<Row> rows;
    const Json& groups = input.at("groups");
    if (!groups.isArray()) {
        return errorResult("match", "groups must be an array");
    }

    for (const Json& group : groups.arr) {
        if (!group.isObject()) continue;

        int groupId = getInt(group, "group_id", 0);
        if (containsInt(joinedGroupIds, groupId)) continue;

        string groupName = getString(group, "group_name", "unknown_group");
        vector<string> groupTags = getStringArray(group, "group_tags");
        int currentMember = getInt(group, "current_member", 0);
        int maxMember = getInt(group, "max_member", 0);
        int todayCheckinCount = getInt(group, "today_checkin_count", 0);

        vector<string> commonTags;
        int commonCount = countCommonTags(userTags, groupTags, &commonTags);

        double tagScore = 0.0;
        if (!userTags.empty()) {
            tagScore = (double)commonCount / (double)userTags.size() * 100.0;
        }

        double activeScore = 0.0;
        if (currentMember > 0) {
            activeScore = (double)todayCheckinCount / (double)currentMember * 100.0;
            if (activeScore > 100.0) activeScore = 100.0;
        }

        double memberScore = 0.0;
        if (maxMember > 0) {
            memberScore = (1.0 - (double)currentMember / (double)maxMember) * 100.0;
            if (memberScore < 0.0) memberScore = 0.0;
            if (memberScore > 100.0) memberScore = 100.0;
        }

        double matchScore = tagScore * 0.60 + activeScore * 0.25 + memberScore * 0.15;

        string reason = "matched_tags_count=" + to_string(commonCount);
        if (!commonTags.empty()) {
            reason += "; matched_tags=";
            for (size_t i = 0; i < commonTags.size(); ++i) {
                if (i) reason += ",";
                reason += commonTags[i];
            }
        }

        rows.push_back({groupId, groupName, matchScore, tagScore, activeScore, memberScore, reason});
    }

    sort(rows.begin(), rows.end(), [](const Row& a, const Row& b) {
        if (fabs(a.matchScore - b.matchScore) > 1e-9) return a.matchScore > b.matchScore;
        if (fabs(a.activeScore - b.activeScore) > 1e-9) return a.activeScore > b.activeScore;
        return a.groupId < b.groupId;
    });

    if (topN <= 0 || topN > (int)rows.size()) topN = (int)rows.size();

    Json data = Json::array();
    for (int i = 0; i < topN; ++i) {
        Json item = Json::object();
        item["group_id"] = Json(rows[i].groupId);
        item["group_name"] = Json(rows[i].groupName);
        item["match_score"] = Json(rows[i].matchScore);
        item["tag_score"] = Json(rows[i].tagScore);
        item["active_score"] = Json(rows[i].activeScore);
        item["member_score"] = Json(rows[i].memberScore);
        item["reason"] = Json(rows[i].reason);
        data.push_back(item);
    }

    return successResult("match", data);
}

Json handleScore(const Json& input) {
    int duration = getInt(input, "duration", 0);
    string content = getString(input, "content", "");
    int continuousDays = getInt(input, "continuous_days", 0);
    bool isDuplicateToday = getBool(input, "is_duplicate_today", false);

    int contentLength = (int)content.size(); // For Chinese UTF-8, this is byte length. Good enough for V1.
    bool valid = true;
    string message = "score calculated";

    if (duration <= 0 || contentLength <= 0) {
        valid = false;
        message = "invalid checkin: duration or content is empty";
    }

    if (isDuplicateToday) {
        valid = false;
        message = "duplicate checkin today: no score added";
    }

    int baseScore = 0;
    int durationScore = 0;
    int streakScore = 0;
    int contentScore = 0;
    int totalScore = 0;

    if (valid) {
        baseScore = 10;

        if (duration < 30) durationScore = 2;
        else if (duration < 60) durationScore = 5;
        else if (duration < 120) durationScore = 8;
        else durationScore = 10;

        if (continuousDays >= 30) streakScore = 10;
        else if (continuousDays >= 14) streakScore = 8;
        else if (continuousDays >= 7) streakScore = 5;
        else if (continuousDays >= 3) streakScore = 3;

        if (contentLength >= 50) contentScore = 5;
        else if (contentLength >= 20) contentScore = 3;

        totalScore = baseScore + durationScore + streakScore + contentScore;
        if (totalScore > 30) totalScore = 30;
    }

    Json data = Json::object();
    data["valid"] = Json(valid);
    data["checkin_score"] = Json(totalScore);
    data["base_score"] = Json(baseScore);
    data["duration_score"] = Json(durationScore);
    data["streak_score"] = Json(streakScore);
    data["content_score"] = Json(contentScore);
    data["content_length"] = Json(contentLength);
    data["message"] = Json(message);

    return successResult("score", data);
}

Json handleRanking(const Json& input) {
    int topN = getInt(input, "top_n", 10);
    string type = getString(input, "type", "total");
    const Json& users = input.at("users");
    if (!users.isArray()) return errorResult("ranking", "users must be an array");

    struct UserRank {
        int userId;
        string nickname;
        string avatar;
        int score;
        int continuousDays;
        int totalDuration;
        string lastCheckinTime;
    };

    vector<UserRank> arr;
    for (const Json& u : users.arr) {
        if (!u.isObject()) continue;
        UserRank item;
        item.userId = getInt(u, "user_id", 0);
        item.nickname = getString(u, "nickname", "user");
        item.avatar = getString(u, "avatar", "");
        item.score = getInt(u, "score", 0);
        item.continuousDays = getInt(u, "continuous_days", 0);
        item.totalDuration = getInt(u, "total_duration", 0);
        item.lastCheckinTime = getString(u, "last_checkin_time", "9999-99-99 99:99:99");
        arr.push_back(item);
    }

    sort(arr.begin(), arr.end(), [](const UserRank& a, const UserRank& b) {
        if (a.score != b.score) return a.score > b.score;
        if (a.continuousDays != b.continuousDays) return a.continuousDays > b.continuousDays;
        if (a.totalDuration != b.totalDuration) return a.totalDuration > b.totalDuration;
        if (a.lastCheckinTime != b.lastCheckinTime) return a.lastCheckinTime < b.lastCheckinTime;
        return a.userId < b.userId;
    });

    if (topN <= 0 || topN > (int)arr.size()) topN = (int)arr.size();

    Json data = Json::array();
    for (int i = 0; i < topN; ++i) {
        Json item = Json::object();
        item["rank"] = Json(i + 1);
        item["user_id"] = Json(arr[i].userId);
        item["nickname"] = Json(arr[i].nickname);
        item["avatar"] = Json(arr[i].avatar);
        item["score"] = Json(arr[i].score);
        item["continuous_days"] = Json(arr[i].continuousDays);
        item["total_duration"] = Json(arr[i].totalDuration);
        item["last_checkin_time"] = Json(arr[i].lastCheckinTime);
        data.push_back(item);
    }

    Json outData = Json::object();
    outData["type"] = Json(type);
    outData["ranking"] = data;
    return successResult("ranking", outData);
}

void addIssue(Json& issues, const string& level, const string& field, const string& message, int index = -1) {
    Json item = Json::object();
    item["level"] = Json(level);
    item["field"] = Json(field);
    item["message"] = Json(message);
    if (index >= 0) item["index"] = Json(index);
    issues.push_back(item);
}

Json handleValidate(const Json& input) {
    Json errors = Json::array();
    Json warnings = Json::array();

    // Validate score input if fields exist.
    if (input.has("duration") || input.has("content")) {
        int duration = getInt(input, "duration", 0);
        string content = getString(input, "content", "");
        int continuousDays = getInt(input, "continuous_days", 0);
        if (duration <= 0) addIssue(errors, "error", "duration", "duration must be greater than 0");
        if (duration > 480) addIssue(warnings, "warning", "duration", "duration is too large; recommended max is 480 minutes");
        if (content.empty()) addIssue(errors, "error", "content", "content must not be empty");
        if (continuousDays < 0) addIssue(errors, "error", "continuous_days", "continuous_days must not be negative");
    }

    // Validate groups.
    const Json& groups = input.at("groups");
    if (groups.isArray()) {
        for (size_t i = 0; i < groups.arr.size(); ++i) {
            const Json& g = groups.arr[i];
            if (!g.isObject()) {
                addIssue(errors, "error", "groups", "group item must be object", (int)i);
                continue;
            }
            int groupId = getInt(g, "group_id", 0);
            int currentMember = getInt(g, "current_member", 0);
            int maxMember = getInt(g, "max_member", 0);
            int todayCheckin = getInt(g, "today_checkin_count", 0);
            if (groupId <= 0) addIssue(errors, "error", "group_id", "group_id must be positive", (int)i);
            if (currentMember < 0) addIssue(errors, "error", "current_member", "current_member must not be negative", (int)i);
            if (maxMember <= 0) addIssue(errors, "error", "max_member", "max_member must be greater than 0", (int)i);
            if (maxMember > 0 && currentMember > maxMember) addIssue(errors, "error", "current_member", "current_member must not exceed max_member", (int)i);
            if (todayCheckin < 0) addIssue(errors, "error", "today_checkin_count", "today_checkin_count must not be negative", (int)i);
            if (todayCheckin > currentMember && currentMember >= 0) addIssue(warnings, "warning", "today_checkin_count", "today_checkin_count is greater than current_member", (int)i);
        }
    }

    // Validate ranking users.
    const Json& users = input.at("users");
    if (users.isArray()) {
        for (size_t i = 0; i < users.arr.size(); ++i) {
            const Json& u = users.arr[i];
            if (!u.isObject()) {
                addIssue(errors, "error", "users", "user item must be object", (int)i);
                continue;
            }
            int userId = getInt(u, "user_id", 0);
            int score = getInt(u, "score", 0);
            int continuousDays = getInt(u, "continuous_days", 0);
            int totalDuration = getInt(u, "total_duration", 0);
            if (userId <= 0) addIssue(errors, "error", "user_id", "user_id must be positive", (int)i);
            if (score < 0) addIssue(errors, "error", "score", "score must not be negative", (int)i);
            if (continuousDays < 0) addIssue(errors, "error", "continuous_days", "continuous_days must not be negative", (int)i);
            if (totalDuration < 0) addIssue(errors, "error", "total_duration", "total_duration must not be negative", (int)i);
            if (getString(u, "nickname", "").empty()) addIssue(warnings, "warning", "nickname", "nickname is empty; default can be used", (int)i);
        }
    }

    Json data = Json::object();
    data["valid"] = Json(errors.arr.empty());
    data["error_count"] = Json((int)errors.arr.size());
    data["warning_count"] = Json((int)warnings.arr.size());
    data["errors"] = errors;
    data["warnings"] = warnings;
    return successResult("validate", data);
}

int main(int argc, char* argv[]) {
    string mode = "unknown";
    try {
        if (argc != 4) {
            Json out = errorResult(mode, "usage: algorithm.exe <match|score|ranking|validate> input.json result.json");
            cout << jsonDump(out) << endl;
            return 1;
        }

        mode = argv[1];
        string inputPath = argv[2];
        string outputPath = argv[3];

        string text = readFile(inputPath);
        JsonParser parser(text);
        Json input = parser.parse();

        Json result;
        if (mode == "match") {
            result = handleMatch(input);
        } else if (mode == "score") {
            result = handleScore(input);
        } else if (mode == "ranking") {
            result = handleRanking(input);
        } else if (mode == "validate") {
            result = handleValidate(input);
        } else {
            result = errorResult(mode, "unknown mode: " + mode);
        }

        writeFile(outputPath, jsonDump(result));
        return result.at("success").isBool() && result.at("success").b ? 0 : 1;
    } catch (const exception& e) {
        Json out = errorResult(mode, e.what());
        if (argc == 4) {
            try { writeFile(argv[3], jsonDump(out)); } catch (...) {}
        }
        cerr << jsonDump(out) << endl;
        return 1;
    }
}
