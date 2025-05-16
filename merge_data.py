import os
import pandas as pd

# 获取当前脚本的绝对路径
script_dir = os.path.dirname(os.path.abspath(__file__))

def merge_bed(exon_bed, intron_bed, output_bed):
    df_exon = pd.read_csv(exon_bed, sep="\t", header=0)
    df_intron = pd.read_csv(intron_bed, sep="\t", header=0)

    df_exon["location"] = df_exon["location"].astype(str).map(lambda x: "exon" + x)
    df_intron["location"] = df_intron["location"].astype(str).map(lambda x: "intron" + x)

    # 合并
    df_merged = pd.concat([df_exon, df_intron])
    df_sort = df_merged.sort_values(by=["#chrom", "start"], ascending=[True, True])
    df_sort.to_csv(output_bed, sep="\t", index=False, header=None)

if not os.path.exists("public/data"):
    os.makedirs("public/data")


merge_bed(
    os.path.join(script_dir, "ManeSelectBed/GRCh37/Gencode.GRCh37.exon.cor.bed"),
    os.path.join(script_dir, "ManeSelectBed/GRCh37/Gencode.GRCh37.intron.bed"),
    os.path.join(script_dir, "public/data/GRCh37.bed")
)
merge_bed(
    os.path.join(script_dir, "ManeSelectBed/GRCh38/Gencode.GRCh38.exon.cor.bed"),
    os.path.join(script_dir, "ManeSelectBed/GRCh38/Gencode.GRCh38.intron.bed"),
    os.path.join(script_dir, "public/data/GRCh38.bed")
)

